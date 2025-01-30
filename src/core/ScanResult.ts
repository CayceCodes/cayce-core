import { SyntaxNode } from "tree-sitter";
import { ScanRule } from "../rule/ScanRule";

/**
 * Violation class
 * Simple object for providing some structure and behavior to the rule on the subject of parsing
 */
export default class ScanResult{
    Rule: ScanRule;
    SourceNode: SyntaxNode;
    FilePath: string;
    Message: string;

    _metaData: Array<any>;

    /**
     * constructor(...) Entry point for new objects.
     * @param node 
     * @param rule 
     * @param args 
     */
    constructor(sourceNode: SyntaxNode, rule: ScanRule, filePath: string, ...metaData: Array<any>){
        this.Rule = rule;
        this.FilePath = filePath;
        this.SourceNode = sourceNode;;
        this._metaData = metaData ?? [];
        
        this.Message = this.Rule.Message;

        for(let element of this._metaData){
            this.Message = this.Message.replace(`%${element[0]}%`,`${element[1]}`);
        }
    }



}

