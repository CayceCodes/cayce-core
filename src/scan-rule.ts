import Parser, { Language, QueryCapture, Query } from 'tree-sitter';
import { RuleSeverity } from './rule-severity.js';
import ScanRuleProperties from './scan-rule-properties.js';

/**
 * This class provides the basis for all static analysis rules executed by Cayce. Primary processing is provided by the validate method, as it covers most cases and relies on the tree sitter query for accuracy.
 */

/**
 * Decorator for adding a message property to a ScanRule class.
 * The message provides context about the rule's purpose and output.
 */
export function message(message: string) {
    return function (target: { prototype: ScanRuleProperties }) {
        target.prototype.Message = message;
    };
}

/**
 * Decorator for setting a human-readable name for a ScanRule class.
 * This name gives an overview of the rule's intent.
 */
export function name(message: string) {
    return function (target: { prototype: ScanRuleProperties }) {
        target.prototype.Name = message;
    };
}

/**
 * Decorator for categorizing a ScanRule class.
 * Categories help in organizing and filtering rules based on their purpose or domain.
 */
export function category(category: string) {
    return function (target: { prototype: ScanRuleProperties }) {
        target.prototype.Category = category;
    };
}

/**
 * Decorator for defining the Tree-sitter query associated with a ScanRule class.
 * The query is used to identify the syntax nodes of interest in the source code.
 */
export function treeQuery(treeQuery: string) {
    return function (target: { prototype: ScanRuleProperties }) {
        target.prototype.TreeQuery = treeQuery;
    };
}

/**
 * Decorator for providing a suggestion on how to address or fix the issue identified by the rule.
 * Suggestions offer actionable advice to developers for resolving potential problems.
 */
export function suggestion(suggestion: string) {
    return function (target: { prototype: ScanRuleProperties }) {
        target.prototype.Suggestion = suggestion;
    };
}

/**
 * Decorator for defining the context in which a ScanRule class is applicable.
 * Context can specify whether the rule is used for scanning violations, measuring code metrics, or both.
 */
export function context(context: string) {
    return function (target: { prototype: ScanRuleProperties }) {
        target.prototype.Context = context;
    };
}

/**
 * Decorator for assigning a result type to a ScanRule class.
 * Result types categorize the outcomes of applying the rule, such as violations or informational findings.
 */
export function ruleSeverity(ruleSeverity: RuleSeverity) {
    return function (target: { prototype: ScanRuleProperties }) {
        target.prototype.RuleSeverity = ruleSeverity;
    };
}

/**
 * Base class for defining scan rules. Scan rules are used to identify patterns or issues in source code
 * by leveraging Tree-sitter queries and additional logic for validation and measurement.
 */
export abstract class ScanRule implements ScanRuleProperties {
    RuleSeverity!: number;
    Message!: string;
    Category!: string;
    Priority!: number;
    Suggestion!: string;
    Name!: string;
    TreeQuery!: string;
    Context!: string;
    TreeSitterLanguage!: Language;

    protected rawSource!: string;

    /**
     * Primary method for validating query matches, intended to replace individual validate methods. If a rule requires some sort of further filtering, the quickest way to built that out is to call super,validate (this method from the specific rule subclass) and then filter the results, handing the result back to the consumer.
     * NOTE: It is perfectly valid to use alternative methods of traversing the source in this method. If needed, this could support plain regex, an AST implementation such as ANTLR or just plain parsing through script. The only thing that matters is the resulting syntax nodes. As these are tree-sitter specific, they would need to be constructed manually if the CST isn't used.
     * @param `targetSource` {string} - The source code to be scanned. Does not need to compile, just have a general adherence to the Apex language standard.
     *                               NOTE: Double quotes in strings *will* break tree-sitter. This is the only currently known issue with invalid code.
     * @param `parser` {TreeSitter.Parser} - An instance of TreeSitter's language independent object parser
     *                          NOTE: We may not even need this as a parameter. Changes to this class may have made it redundant/unnecessary.
     * @returns {Parser.SyntaxNode[]} - A list of SyntaxNodes that fall within the criteria specified in the tree-sitter query, and potentially in any further filtering logic in the validate method.
     *
     */
    validate(targetSource: string, parser: Parser): Parser.SyntaxNode[] {

        this.rawSource = targetSource;
        parser.setLanguage(this.TreeSitterLanguage);
        const rootTree: Parser.Tree = parser.parse(targetSource);
        const queryInstance: Query = new Query(this.TreeSitterLanguage, this.TreeQuery);
        const results: Parser.SyntaxNode[] = [];
        const captures: QueryCapture[] = queryInstance.captures(rootTree.rootNode);
        captures.forEach((capture) => {
            results.push(capture.node);
        });
        return results;
    }

    /**
     * As we are trying to protect the source code that is sent to the rule (any changes after it's been set can be catastrophic) this provides a way to inspect the value.
     * @returns {string} Source code stored in `this.rawSource`
     */
    getSource(): string {
        return this.rawSource;
    }
}
