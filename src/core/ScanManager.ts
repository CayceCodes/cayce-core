import Parser, { type Language, QueryCapture, SyntaxNode } from 'tree-sitter';
import { ScanResult } from 'cayce-types';
import { ScanRule } from 'cayce-types';
import TreeSitter from 'tree-sitter';
import { RuleSeverity } from 'cayce-types';

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
     * @param languageToDump A valid tree sitter language. This will return all valid grammar types for a given language (named or anonymous) as a JSON string
     * @returns `string` JSON of all valid grammar types
     */
    dump(languageToDump: TreeSitter.Language): string {
        return JSON.stringify(languageToDump.nodeTypeInfo);
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
     * TODO: Refactor the private commonScan method so that it iterates through a supplied set of rules invoked through a dynamic import
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
        const contextRules = this.scannerRules;

        let scanResultList: ScanResult[] = [];

        for (const ruleIteration of contextRules) {
            try {
                ruleIteration.validate(this.sourceCodeToScan, this.treeSitterParser).forEach((capturedNode) => {
                    scanResultList.push(new ScanResult(ruleIteration, capturedNode));
                });
            } catch (treeSitterError: unknown) {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                console.error(`A tree-sitter query error occurred: ${treeSitterError}`);
            }
        }
        return scanResultList;
    }
}
