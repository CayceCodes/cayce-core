import Parser, { QueryCapture, SyntaxNode } from 'tree-sitter';
import * as TreeSitter from 'tree-sitter';
import ScanResult, { ResultType } from '../results/ScanResult';
import { ScanRule } from '../rule/ScanRule.js';
import Language from '../types/Language.js';

type ScannerResult = Map<string, ScanResult[]>;
type ScanContext = 'scan' | 'measure';

export default class ScanManager {
    private treeSitterNodeTree: Parser.Tree;
    private treeSitterParser: Parser;
    private readonly treeSitterLanguage: Language;
    private scannerRules: ScanRule[];
    private readonly filePath: string;
    private readonly sourceCodeToScan: string;

    /**
     * The ScanManager is the main class for scanning code. It is responsible for scanning code for violations. This
     * class requires construction via this constructor which dictates the rules to be used, the language to be scanned,
     * and the source code to be scanned.
     * @param parser A tree-sitter parser instance
     * @param language A tree-sitter language instance
     * @param sourcePath The path to the source code being scanned
     * @param sourceCode The source code to be scanned
     * @param rules An array of ScanRule objects that dictate what to scan for
     */
    constructor(parser: Parser, language: Language, sourcePath: string, sourceCode: string, rules: Array<ScanRule>) {
        this.filePath = sourcePath;
        this.sourceCodeToScan = sourceCode;
        this.scannerRules = rules;
        this.treeSitterLanguage = language;
        this.treeSitterParser = parser;
        this.treeSitterParser.setLanguage(language);
        this.treeSitterNodeTree = parser.parse(this.sourceCodeToScan);
    }

    /**
     * Dump is here as a way to quickly test out new rules without having to create them. It's basically
     * a mini playground.
     * @param queryString A tree sitter query. It can be as simple or as complex as you want.
     * @returns `string` The actual source fragment(s) selected by the query, identified in the matches collection, and stored in the capture collection under that.
     */
    dump(queryString: string): string {
        // Use dump as a mechanism to allow for ad-hoc ts queries?
        const result: Array<string> = [];
        if (queryString === '') {
            queryString = `(class_declaration @decl)`;
        }
        const query: TreeSitter.Query = new TreeSitter.Query(this.treeSitterLanguage, queryString);
        const globalCaptures: QueryCapture[] = query.captures(this.treeSitterNodeTree.rootNode);
        globalCaptures.forEach((capture) => {
            result.push(`@${capture.name}=${capture.node.text}`);
        });
        return JSON.stringify(result);
    }

    /**
     * Measure is a scanner method for counting things. It's a way to measure the codebase for various metrics.
     * For instance, you could measure the number of variables < three characters long.
     */
    async measure(): Promise<ScannerResult> {
        return this.commonScan('measure');
    }

    /**
     * Scan is the scanner main method for inspecting code for violations of given rules.
     * Rules are provided to the ScanManager from elsewhere.
     * TODO: Refactor the private commonScan method so that it iterates through a supplied set of rules invoked through a dynamic import
     * @returns A map of categories->list of violations
     */
    async scan(): Promise<ScannerResult> {
        return await this.commonScan('scan');
    }

    /**
     * This method is used to initialize the scanner result map. It is used to store the results of the scan.
     * This prevents us from if/els-ing on whether a category exists in the map.
     * @returns `Map<string, Array<ScanResult>>` A map of category->array of violations. Allows for some
     * @private
     */
    private initializeScannerResult(): ScannerResult {
        const resultMap: ScannerResult = new Map<string, Array<ScanResult>>();
        const categories = this.scannerRules.map((rule) => rule.Category);
        const uniqueCategories = [...new Set(categories)];
        for (const category of uniqueCategories) {
            resultMap.set(category, []);
        }
        return resultMap;
    }

    /**
     * Common scan method used by both scan and measure. Both were consolidated here as both essentially
     * did the same thing, just reported the results differently. Realizing that how the report is formatted
     * should be the purview of something other than the scanner, I moved that stuff out.
     * @param context What operational context we are using. Scan or measure are currently supported.
     * @returns `Map<string, Array<ScanResult>>` A map of category->array of violations. Allows for some
     * custom organization
     */
    private async commonScan(context: ScanContext): Promise<ScannerResult> {
        const resultMap: ScannerResult = this.initializeScannerResult();
        const contextRules = this.scannerRules.filter((rule) => rule.Context.includes(context));

        for (const rule of contextRules) {
            // Ensure that the rule.Priority is not larger than the maximum ResultType (Violation)
            const normalizedPriority: ResultType =
                rule.Priority > ResultType.VIOLATION ? ResultType.VIOLATION : rule.Priority;

            const queryText = `${rule.Query}${rule.RegEx ? `(#match? @exp "${rule.RegEx}")` : ''}`;

            try {
                const matches = new TreeSitter.Query(this.treeSitterLanguage, queryText).matches(
                    this.treeSitterNodeTree.rootNode
                );
                if (rule.validateTree(matches).length > 0) {
                    this.addScanResult(rule, normalizedPriority, resultMap);
                }

                this.processMatches(matches, rule, normalizedPriority, resultMap);
            } catch (treeSitterError: unknown) {
                console.error(`A tree-sitter query error occurred: ${treeSitterError}`);
            }
        }
        return resultMap;
    }

    /**
     * This method is used to process the matches returned from the tree-sitter query. It iterates through the found
     * matches and processes them according to the rules provided.
     * @param matches The matches found by the tree-sitter query
     * @param rule The rule to be applied to the matches
     * @param priority The priority of the rule
     * @param resultMap The map of categories->violations
     * @private
     */
    private processMatches(
        matches: TreeSitter.QueryMatch[],
        rule: ScanRule,
        priority: ResultType,
        resultMap: ScannerResult
    ): void {
        matches.forEach((match) => {
            match.captures.forEach((capture) => {
                if (rule.validate(capture.node)) {
                    const scanResult = new ScanResult(rule, this.sourceCodeToScan, priority);
                    resultMap.get(rule.Context)?.push(scanResult);
                }
            });
        });
    }

    private addScanResult(rule: ScanRule, normalizedPriority: ResultType, resultMap: Map<string, ScanResult[]>): void {
        rule.Node = this.treeSitterNodeTree.rootNode;
        const treeScanResult: ScanResult = new ScanResult(rule, this.sourceCodeToScan, normalizedPriority);
        resultMap.get(rule.Context)?.push(treeScanResult);
    }
}

/**
 * Simple object for containing information returned from a dump operation. Dump accepts
 * a tree sitter query and spits back the requested source fragment to the console.
 */
export class DumpResult {
    SourceFragment: string;
    StartIndex: number;
    EndIndex: number;

    constructor(node: SyntaxNode, source: string) {
        this.SourceFragment = source.substring(node.startIndex, node.endIndex);
        this.StartIndex = node.startIndex;
        this.EndIndex = node.endIndex;
    }
}

// const RULE_REGISTRY = {
//   rules: [
//     {
//       name: 'Variables',
//       queries: [
//         {
//           name: 'Total',
//           context: 'measure',
//           message: 'This is the total number of variable declarations, not counting method arguments.',
//           query: '(variable_declarator (identifier) @exp)',
//         },
//         {
//           name: 'Length < 3',
//           context: 'scan,measure',
//           message: 'Variables should be descriptive, clear, and concise with names over three characters long.',
//           query: '(variable_declarator (identifier) @exp)',
//           function: function (node) {
//             return node.text.length > 3;
//           },
//         },
//         {
//           name: 'Trivial RegEx',
//           context: 'scan,measure',
//           message: 'A trivial RegEx (for testing) has produced some matches.',
//           query: '(variable_declarator (identifier) @exp)',
//           pattern: 'foo_[a-zA-Z0-9]*',
//         },
//       ],
//     },
//   ],
// };
