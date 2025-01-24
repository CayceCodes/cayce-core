import TsSfApex from "tree-sitter-sfapex";
import ScanRule from "./core/ScanRule";
<<<<<<< HEAD
import { RULE_REGISTRY } from "./rules/RuleRegistry";
=======
import { RULE_REGISTRY } from "./rules/configuration/RuleRegistry";
>>>>>>> bad0e45ca6019ee3254ae72bccfe52f5fa16df95
import Parser, { SyntaxNode, Tree } from "tree-sitter";
import ViolationAlert from "./core/ViolationAlert";

const testSource = `
public with sharing class SampleThing{

    private Integer i;

    public SampleThing(Integer newValue){
        i = newValue;
        Integer j;
        Integer k = 10;
        j = i * 2;
        i = j;
        i++;
        i++;
        i++;
        i++;
        i++;
        i++;
        i++;
        i++;
        i++;
        i++;
        i++;
        i++;
    }

    public Boolean myMethod(Integer someStuff){
        // TODO: Sys!
        System.debug('hello');
        if(someStuff < 10){
            i = -1;
            return true;
        }
        return false;
    }
}
`;



let foo = RULE_REGISTRY
let parser = new Parser();
parser.setLanguage(TsSfApex.apex);
const tree: Tree = parser.parse(testSource)

const violationAlerts: Array<ViolationAlert> =[];

let splitter = "\n";

if(testSource.includes("\r\n")){
    splitter = "\r\n";
}

const sourceLines = testSource.split(splitter);


for(let r of foo.rules){
    const describingNodes = tree.rootNode.descendantsOfType(r.describingNode);
    let nodesToScan: Array<SyntaxNode> = []
    for(let node of describingNodes){
        if(node.parent.grammarType == r.rootNode){
            nodesToScan.push(node);
        }
    }

    if(nodesToScan.length > 0){
        for(let violation of r.instance.inspect(nodesToScan,r.arguments)){
            violationAlerts.push(new ViolationAlert(violation,r));
        }
    }
    console.log(violationAlerts);
    for(let alertItem of violationAlerts){
        const startAt = alertItem.ViolationInstance.TargetNode.startIndex;
        const endAt = alertItem.ViolationInstance.TargetNode.endIndex;
        console.log(testSource.substring(startAt,endAt));
    }
}