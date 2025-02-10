import Parser, { QueryCapture, SyntaxNode } from 'tree-sitter';
import * as TreeSitter from 'tree-sitter';
import ScanResult, { ResultType } from '../results/ScanResult';
import { ScanRule } from '../rule/ScanRule.js';
import Language from '../types/Language.js';
import TsSfApex from 'tree-sitter-sfapex';

export default class ScanManager {
    private _nodeTree: Parser.Tree;
    private _parser: Parser;
    private _language: Language;
    private _rules: Array<ScanRule>;
    private _sourceCode: string;

    /**
     * @description This just assigns the various class fields and is used to initialize the parser object with the appropriate language and source to be scanned
     * @param parser Tree sitter parser
     * @param language Grammar we will be using as a Tree Sitter language
     * @param sourceCode The raw source to be scanned
     * @param rules A list of objects that extend the ScanRule class
     */

    constructor(parser: Parser, language: any, sourceCode: string, rules: Array<ScanRule>) {
        this._sourceCode = sourceCode;
        this._rules = rules;
        this._language = language;
        this._parser = parser;
        this._parser.setLanguage(language);
        this._nodeTree = parser.parse(this._sourceCode);
    }

    /**
     * Dump is here as a way to quickly test out new rules without having to create them. It's basically
     * a mini playground.
     * @param queryString A tree sitter query. Can be as simple or as complex as you want.
     * @returns `string` The actual source fragment(s) selected by the query, identified in the matches collection, and stored in the captures collection under that.
     */
    dump(queryString: string): string {
        // Use dump as a mechanism to allow for ad-hoc ts queries?
        if (queryString === '') {
            queryString = `(parser_output(block_comment)@exp)`;
        }
        const result: Array<string> = [];
        const query: TreeSitter.Query = new TreeSitter.Query(TsSfApex.apex, queryString);
        const globalCaptures: QueryCapture[] = query.captures(this._nodeTree.rootNode);
        globalCaptures.forEach((capture) => {
            result.push(`
FIELD:
@${capture.name}
SOURCE:
${capture.node.text}
START POSITION:
${JSON.stringify(capture.node.startPosition)}
END POSITION:
${JSON.stringify(capture.node.endPosition)}`);
        });
        result.push(`
TOTAL CAPTURES:
${globalCaptures.length}`);
        return result.join(`\\n`);
    }

    /**
     * @description A "measure" type scan is generally informational and is tailored towards reporting use cases. This allows for things similar to what CLOC (count lines of code) does
     * @returns  Scan results, as an array of `ScanResult`
     */
    async measure(): Promise<Map<string, ScanResult[]>> {
        return this._scan('measure');
    }

    /**
     * Scan is the scanner scannerific scantaculous main method for inspecting code for violations of given rules.
     * Rules are provided to the ScanManager from elsewhere.
     * TODO: Convert to async. Refactor the private _scan method so that it iterates through a supplied set of rules invoked through a dynamic import
     * @returns A map of cateogries->list of violations
     */
    async scan(): Promise<Map<string, ScanResult[]>> {
        return await this._scan('scan');
    }

    /**
     * Common scan method used by both scan and measure. Both were consolidated here as both essentially
     * did the same thing, just reported the results differently. Realizing that how the report is formatted
     * should be the purview of something other than the scanner, I moved that stuff out.
     * @param context What operational contecxt we are using. Scan or measure are currently supported.
     * @returns `Map<string,Array<ScanResult>>` A map of category->array of violations. Allows for some
     * custom organization
     */
    private async _scan(context: string): Promise<Map<string, ScanResult[]>> {
        // const tree = this._nodeTree;
        // if (this._rules === null || this._rules.length === 0) {
        // }
        const resultMap: Map<string, Array<ScanResult>> = new Map<string, Array<ScanResult>>();

        for (const rule of this._rules) {
            let type: ResultType = rule.Priority;
            if (rule.Priority > ResultType.VIOLATION) {
                type = ResultType.VIOLATION;
            }
            if (!resultMap.has(rule.Category)) {
                resultMap.set(rule.Category, []);
            }

            // First the tree sitter query. :everage the built-in regex
            if (!rule.Context.includes(context)) {
                continue;
            }
            let queryText = rule.Query;
            if (rule.RegEx != null) {
                // Note that tree-sitter is persnickity about regular expressions.
                // It's not that great about giving you feedback if the regex is gibbed.
                // Including this here fragment because I know it works...it's just for reference
                // (#match? @exp "^[a-zA-Z]{0,3}$")

                const regExInsert = rule.RegEx == null ? '' : `(#match? @exp "${rule.RegEx}")`;
                queryText += regExInsert;
            }
            try {
                const query: TreeSitter.Query = new TreeSitter.Query(this._language, queryText);
                const matches: TreeSitter.QueryMatch[] = query.matches(this._nodeTree.rootNode);
                if (rule.validateTree(matches).length > 0) {
                    rule.Node = this._nodeTree.rootNode;
                    const treeScanResult: ScanResult = new ScanResult(rule, this._sourceCode, type);
                    resultMap.get(rule.Context)?.push(treeScanResult);
                }

                if (rule.validateMatches(matches).length > 0) {
                    rule.Node = this._nodeTree.rootNode;
                    const outerScanResult: ScanResult = new ScanResult(rule, this._sourceCode, type);
                    resultMap.get(rule.Context)?.push(outerScanResult);
                }
                matches.forEach((match) => {
                    match.captures.forEach((capture) => {
                        const captureNode: SyntaxNode = capture.node;
                        const isValid = rule.validate(captureNode);
                        if (!isValid) {
                            const newScanResult: ScanResult = new ScanResult(rule, this._sourceCode, type);
                            resultMap.get(rule.Context)?.push(newScanResult);
                        }
                    });
                });
            } catch (treeSitterError: unknown) {
                console.error(`A tree-sitter query error occurred: ${treeSitterError}`);
            }
        }
        return resultMap;
    }
}
