import Parser, { type Language, QueryCapture, SyntaxNode } from 'tree-sitter';
import { ScanRule, ScanResult } from 'cayce-types';
import TreeSitter from 'tree-sitter';

export default class ScanManager {
    private treeSitterNodeTree!: Parser.Tree;
    private treeSitterParser: Parser;
    private readonly treeSitterLanguage!: Language;
    private readonly scannerRules: ScanRule[];
    private readonly sourceCodeToScan: string;

    /**
     * The ScanManager is the main class for scanning code. It is responsible for scanning code for violations. This
     * class requires construction via this constructor which dictates the rules to be used, the language to be scanned,
     * and the source code to be scanned.
     * @param parser A tree-sitter parser instance
     * @param sourceCode The source code to be scanned
     * @param rules An array of ScanRule objects that dictate what to scan for
     */
    constructor(parser: Parser, sourceCode: string, rules: ScanRule[]) {
        this.sourceCodeToScan = sourceCode;
        this.scannerRules = rules;
        this.treeSitterParser = parser;
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
            queryString = `(parser_output)@target`;
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
    async measure(): Promise<ScanResult[]> {
        return this.commonScan();
    }

    /**
     * Scan is the scanner main method for inspecting code for violations of given rules.
     * Rules are provided to the ScanManager from elsewhere.
     * @returns A map of categories->list of violations
     */
    async scan(): Promise<ScanResult[]> {
        return await this.commonScan();
    }

    /**
     * Executes a common scanning operation used by both scan() and measure() methods.
     * Processes all configured rules against the source code and aggregates their results.
     *
     * The method:
     * 1. Normalizes rule priorities
     * 2. Executes each rule's validation logic
     * 3. Transforms validation results into ScanResult objects
     * 4. Applies rule-specific filtering
     *
     * @returns {Promise<ScanResult[]>} A promise that resolves to an array of scan results
     * @throws {Error} When tree-sitter encounters parsing errors
     * @private
     */
    private async commonScan(): Promise<ScanResult[]> {
        const scanPromises = this.scannerRules.map(async (currentRule) => {
            try {
                const currentRuleResults = currentRule
                    .validate(this.sourceCodeToScan, this.treeSitterParser)
                    .map((capturedNode: SyntaxNode): ScanResult => {
                        return new ScanResult(currentRule, capturedNode);
                    });
                return currentRule.filterResults(currentRuleResults);
            } catch (treeSitterError: unknown) {
                console.error(`A tree-sitter query error occurred: ${treeSitterError as Error}`);
                return [];
            }
        });

        const results = await Promise.all(scanPromises);
        return results.flat();
    }
}
