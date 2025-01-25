import { SyntaxNode } from "tree-sitter";
import Rule from "../types/Rule";

/**
 * Violation class
 * Simple object for providing some structure and behavior to the rule on the subject of parsing
 */
export default class Violation{
    Rule: Rule;
    SourceSyntaxNode: SyntaxNode;
    FilePath: string;

    /**
     * constructor(...) Entry point for new objects.
     * @param node 
     * @param rule 
     * @param args 
     */
    constructor(node: SyntaxNode, rule: Rule, filePath: string){
        this.Rule = rule;
        this.FilePath = filePath;
        this.SourceSyntaxNode = node;
    }

}