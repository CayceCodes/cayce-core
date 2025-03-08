import Parser, { SyntaxNode } from 'tree-sitter';
import { ScanResult } from 'cayce-types';
import { ScanRule } from 'cayce-types';
import TreeSitter from 'tree-sitter';

export default class ScanManager {
    private treeSitterParser: Parser;
    private readonly scannerRules: ScanRule[];
    private readonly sourceCodeToScan: string;

    /**
     * Creates a new ScanManager instance for analyzing source code using tree-sitter.
     * class requires construction via this constructor which dictates the rules to be used, the language to be scanned,
     *
     * @param parser - A configured tree-sitter parser instance for the target language
     * @param sourceCode - The source code content to be analyzed
     * @param rules - An array of ScanRule instances that define the analysis criteria
     */
    constructor(parser: Parser, sourceCode: string, rules: ScanRule[]) {
        this.sourceCodeToScan = sourceCode;
        this.scannerRules = rules;
        this.treeSitterParser = parser;
    }

    private getSourceCode(): string {
        return this.sourceCodeToScan;
    }
    /**
     * Dumps the grammar type information for a given tree-sitter language.
     * Useful for debugging and rule development.
     *
     * @param languageToDump - The tree-sitter language to inspect
     * @returns `string` JSON of all valid grammar types
     */
    dump(languageToDump: TreeSitter.Language): string {
        return JSON.stringify(languageToDump.nodeTypeInfo);
    }

    /**
     * Analyzes the source code to collect metrics based on the provided rules.
     * Used for gathering statistics rather than finding violations.
     *
     * @returns A promise resolving to an array of measurement results
     */
    async measure(): Promise<ScanResult[]> {
        return this.commonScan();
    }

    /**
     * Analyzes the source code for rule violations using the configured rules.
     *
     * @returns A promise resolving to an array of rule violation results
     */
    async scan(): Promise<ScanResult[]> {
        return await this.commonScan();
    }

    /**
     * Core scanning implementation shared by both scan() and measure() methods.
     *
     * Process:
     * 1. Validates input conditions (source code and rules presence)
     * 2. Executes each rule's validation logic in parallel
     * 3. Transforms tree-sitter nodes into ScanResult objects
     * 4. Handle any parsing errors that occur during rule execution
     *
     * @returns A promise resolving to an array of scan results
     * @throws Never throws - errors are caught and logged, returning empty results for failed rules
     * @private
     */
    private async commonScan(): Promise<ScanResult[]> {
        if (!this.sourceCodeToScan || !this.scannerRules.length) {
            console.error(`No source code provided for scanning?: ${this.sourceCodeToScan}`);
            return []; 
        }
        const results = await Promise.all(
            this.scannerRules.map((rule: ScanRule): ScanResult[] => {
                try {
                    const validationResults: SyntaxNode[] = rule.validate(this.sourceCodeToScan, this.treeSitterParser);
                    console.dir(validationResults);
                    return validationResults.map((node: SyntaxNode): ScanResult => new ScanResult(rule, node));
                } catch (error: unknown) {
                    console.error(`Tree-sitter query error in rule ${rule.constructor.name}:`, error);
                    return [];
                }
            })
        );

        return results.flat();
    }
}
