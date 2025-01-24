import Parser, { Point, type SyntaxNode, type Tree } from "tree-sitter";
import ScanRule, { configuration } from "./ScanRule.ts";
import ScanRuleInspection from "./ScanRuleInspection.ts"
import Violation from "./Violation.ts"
import NodeRecognizer from "../nodetools/tools.ts";
import { AnyARecord } from "dns";

export default class OLD_ScanManager{
    ScanTargetSource: string;
    ScanTargetSourceFile: string;
    TotalViolations: Array<Violation>;
    ParserInstance: Parser;
    TreeRootNode: SyntaxNode;
    ScanRules: Array<ScanRule>;
    IncludeAnonymousNodes: boolean;
    NodeTypeToInstanceMap: Map<string,SyntaxNode[]>;

    private _allNodes: SyntaxNode[];
    private _nodeCount: Map<string,number>;

    protected ScanRuleList: Array<ScanRule>;

    constructor(sourceCode:string, sourceFileName: string, parser: Parser){
        this.ScanTargetSource = sourceCode;
        this.ScanTargetSourceFile = sourceFileName;
        this.ParserInstance = parser;
        const rawTree: Tree = parser.parse(sourceCode);
        this.TreeRootNode = rawTree.rootNode;
        this.ScanRuleList = new Array<ScanRule>();
        this._allNodes = new Array<SyntaxNode>();
        this._nodeCount = new Map<string,number>();

    }

    dump(node: SyntaxNode, indent = 0) {
        console.log(
            " ".repeat(indent),
            (node.isNamed ? "(" : "") + node.type + (node.isNamed ? ")" : "")
        );
        this._allNodes.push(node);

        for (let childItem of this.IncludeAnonymousNodes ? node.children : node.namedChildren) {
            this.dump(childItem, indent + 2);
        }
    }

    private getAllNodes(startingFromNode: SyntaxNode, forNodeTypes: string[] = []){
        this._allNodes.push(startingFromNode);
        for (let childItem of this.IncludeAnonymousNodes ? startingFromNode.children : startingFromNode.namedChildren) {
            this.getAllNodes(childItem);
        }
    }
    /**
     * begins the scan workflow.  (change to scan unless render = end)
     * 
     */
    scan(scanRegistry: any): ScanManager{
        if(this.TotalViolations == null){
            this.TotalViolations = new Array<Violation>();
        }
        for(const rule of scanRules){
            const config : configuration = rule.RuleConfiguration;
            // Glob, run against everything. Good example would be
            //console.log(`CONFIG=${configurationFileName}`);
            if(config.targetNodeTypeNames.includes("*")){
                rule.inspect(this.TreeRootNode.children);
            }
            else{

                // const targetDescendants: Array<SyntaxNode> = this.TreeRootNode.descendantsOfType(config.targetNodeTypeNames);
                var nodeTypeList : string[] = [];
                
                rule.inspect(this.TreeRootNode.descendantsOfType(config.targetNodeTypeNames));    
                rule.Violations.forEach(thisViolation => {
                    this.TotalViolations.push(thisViolation);
                })
            }
        }
        return(this);
    }

    measure(targetNodeTypes: string[]): per_file_nodes{
        this.getAllNodes(this.TreeRootNode);
        for(let item of this._allNodes){
            if(!this._nodeCount.has(item.grammarType)){
                this._nodeCount[item.grammarType] = 0;
            }
            this._nodeCount[item.grammarType]++;
        }

        const myMap = new Map();
        for (const val of this._allNodes) {
            if(val.grammarType !== '='){
                if(targetNodeTypes === undefined || targetNodeTypes.includes(val.grammarType) || targetNodeTypes.length == 0){
                    if(!myMap.has(val.grammarType)){
                        myMap.set(val.grammarType,0);            
                    }
                    myMap.set(val.grammarType,myMap.get(val.grammarType)+1);
                }

            }
        }
        const countOf = new per_file_nodes(myMap,this.ScanTargetSourceFile);
        //console.log(JSON.stringify(countOf));
        return countOf;
    }

}


//-- ALL THIS DOWN HERE FOR JSON...GONNA FIX THAT

export class node_counts{
    totals_in_project: Map<string,number>;
    per_file: per_file_nodes[];
    
    constructor(){
        this.totals_in_project = new Map();
        this.per_file = [];
    }

    addFileMetrics(fileMetric: per_file_nodes){
        this.per_file.push(fileMetric);

        for(let nodeTypeCount of fileMetric.source_node_types){
            if(!this.totals_in_project.has(nodeTypeCount.node_type_name)){
                this.totals_in_project.set(nodeTypeCount.node_type_name,0);
            }
            this.totals_in_project.set(nodeTypeCount.node_type_name, this.totals_in_project.get(nodeTypeCount.node_type_name) + 1);
        }
    }

}

export class per_file_nodes{
    filename: string;
    source_node_types: source_node_type[];

    constructor(nodeLookup: Map, whichFile: string){
        this.source_node_types = [];
        for(let [key,value] of nodeLookup){
            let nodeType = new source_node_type(key,value);
            this.source_node_types.push(nodeType);
        }
        this.filename = whichFile;
    }
}

export class source_node_type{
    node_type_name: string;
    total_count: number;
    //violations: rule_violation[];

    constructor(name: string, count: number){
        this.node_type_name = name;
        this.total_count = count;
    }
}

// export class rule_violation{
//     rule_name: string;
//     violation_count: number;

//     constructor(rule: string, count: number){
//         this.rule_name = rule;
//         this.violation_count = count;
//     }
// }