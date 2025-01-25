import { SyntaxNode } from "tree-sitter";

/**
 * Violation class
 * Simple object for providing some structure and behavior to the rule on the subject of parsing
 */
export default class Violation {
    RuleQuery: any;
    SourceSyntaxNode: SyntaxNode;
    FilePath: string;

    /**
     * Constructor entry point for new objects.
     * @param node - The syntax node representing the violation.
     * @param rule - The rule associated with the violation (can be of any type).
     * @param ruleQuery - A query or condition related to the rule.
     * @param filePath - The file path where the violation occurred.
     */
    constructor(node: SyntaxNode, rule: any, ruleQuery: any, filePath: string);
}