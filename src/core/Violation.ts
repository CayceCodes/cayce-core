import { SyntaxNode } from "tree-sitter";
import { ScanRule } from "../rule/ScanRule";

/**
 * Violation class
 * Simple object for providing some structure and behavior to the rule on the subject of parsing
 */
export default class Violation{
    Rule: ScanRule;
    SourceNode: SyntaxNode;
    FilePath: string;

    /**
     * constructor(...) Entry point for new objects.
     * @param node 
     * @param rule 
     * @param args 
     */
    constructor(node: SyntaxNode, rule: ScanRule, filePath: string){
        this.Rule = rule;
        this.FilePath = filePath;
        this.SourceNode = node;
    }

}