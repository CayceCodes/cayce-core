import Parser, { QueryCapture, SyntaxNode } from 'tree-sitter';
import * as TreeSitter from 'tree-sitter';
import ScanResult, { ResultType } from '../results/ScanResult';
import { ScanRule } from '../rule/ScanRule.js';
import Language from '../types/Language.js';

type ScannerResult = Map<string, ScanResult[]>;

export default class ScanManager {
    private treeSitterNodeTree: Parser.Tree;
    private treeSitterParser: Parser;
    private readonly treeSitterLanguage: Language;
    private scannerRules: ScanRule[];
    private readonly sourceCodeToScan: string;

    /**
     * The ScanManager is the main class for scanning code. It is responsible for scanning code for violations. This
     * class requires construction via this constructor which dictates the rules to be used, the language to be scanned,
     * and the source code to be scanned.
     * @param parser A tree-sitter parser instance
     * @param language A tree-sitter language instance
     * @param sourceCode The source code to be scanned
     * @param rules An array of ScanRule objects that dictate what to scan for
     */
    constructor(parser: Parser, language: Language, sourceCode: string, rules: Array<ScanRule>) {
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
        return this.commonScan();
    }

    /**
     * Scan is the scanner main method for inspecting code for violations of given rules.
     * Rules are provided to the ScanManager from elsewhere.
     * TODO: Refactor the private commonScan method so that it iterates through a supplied set of rules invoked through a dynamic import
     * @returns A map of categories->list of violations
     */
    async scan(): Promise<ScannerResult> {
        return await this.commonScan();
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
    private async commonScan(): Promise<ScannerResult> {
        const resultMap: ScannerResult = this.initializeScannerResult();
        const contextRules = this.scannerRules;

        const scanResultList: ScanResult[] = [];

        for (const rule of contextRules) {
            // JS: Actually, I kind of want that flexibility in order to provide escalating violation levels if needed
            // Anything higher than a violation can be considered a potential HPI, etc. Thoughts?

            // Ensure that the rule.Priority is not larger than the maximum ResultType (Violation)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const normalizedPriority: ResultType =
                rule.Priority > ResultType.VIOLATION ? ResultType.VIOLATION : rule.Priority;

            const queryText = `${rule.Query}${rule.RegEx ? `(#match? @exp "${rule.RegEx}")` : ''}`;

            try {
                const filteredRoot: SyntaxNode = rule.preFilter(this.treeSitterNodeTree.rootNode);
                // Prettier reformats this into a blatant syntax error
                // eslint-disable-next-line prettier/prettier
                const captures: QueryCapture[] = new TreeSitter.Query(this.treeSitterLanguage, queryText).captures(
                    filteredRoot
                );
                // Just the nodes for the following function overrides
                const capturedNodes: SyntaxNode[] = captures.map((captureInstance) => {
                    return captureInstance.node;
                });

                // Default to scan
                const ruleContext = rule.Context ?? 'scan';

                if (ruleContext.includes('measure')) {
                    rule.measureNodes(capturedNodes);
                }

                scanResultList.push(...rule.validateNodes(capturedNodes));

                capturedNodes.forEach((node) => {
                    scanResultList.push(...rule.validateNode(node));
                });
            } catch (treeSitterError: unknown) {
                // TODO: Logging
                console.error(`A tree-sitter query error occurred: ${treeSitterError}`);
            }
        }
        return resultMap;
    }

    private addScanResult(rule: ScanRule, normalizedPriority: ResultType, resultMap: Map<string, ScanResult[]>): void {
        rule.Node = this.treeSitterNodeTree.rootNode;
        const treeScanResult: ScanResult = new ScanResult(rule, this.sourceCodeToScan, normalizedPriority);
        resultMap.get(rule.Context)?.push(treeScanResult);
    }
}
