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
     * @param language A tree-sitter language instance
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
     * Common scan method used by both scan and measure. Both were consolidated here as both essentially
     * did the same thing, just reported the results differently. Realizing that how the report is formatted
     * should be the purview of something other than the scanner, I moved that stuff out.
     * Consolidated all rule methods into validateQuery. Only that and preFilter remain, and their usefulness should
     * be evident.
     * @returns `Map<string, Array<ScanResult>>` A map of category->array of violations. Allows for some
     * custom organization
     */
    private async commonScan(): Promise<ScanResult[]> {
        const contextRules = this.scannerRules;

        let scanResultList: ScanResult[] = [];

        for (const ruleIteration of contextRules) {
            // This next line normalizes the priority to the highest level of severity in case someone tries to
            // execute a rule with a priority of 16452 or something. That priority wouldn't be mappable to
            // sarif severity levels.
            ruleIteration.Priority =
                ruleIteration.Priority > RuleSeverity.VIOLATION ? RuleSeverity.VIOLATION : ruleIteration.Priority;

            try {
                ruleIteration.validate(this.sourceCodeToScan, this.treeSitterParser).forEach((capturedNode) => {
                    scanResultList.push(new ScanResult(ruleIteration, capturedNode));
                });
                scanResultList = ruleIteration.filterResults(scanResultList);
            } catch (treeSitterError: unknown) {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                console.error(`A tree-sitter query error occurred: ${treeSitterError}`);
            }
        }
        return scanResultList;
    }
}
