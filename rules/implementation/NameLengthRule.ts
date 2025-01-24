import ScanRule from "../../core/ScanRule.ts";
import Node, { SyntaxNode } from "tree-sitter";
import Violation from "../../core/Violation.ts";

export default class NameLengthRule extends ScanRule{
    inspect(whatToScan: Array<SyntaxNode>, args: any) : Array<Violation>{
        const violations: Array<Violation> = [];
        const minimumLength : number = args["minimumLength"]

        for(let node of whatToScan){
            if(node.text.length < minimumLength){
                const nodeViolationItem: Violation = new Violation(node,this);
                violations.push(nodeViolationItem);
            }
        }
        return violations;

    }
}