import Parser, { Tree, SyntaxNode } from "tree-sitter";
import * as TreeSitter from "tree-sitter";
import { RULE_REGISTRY } from "../rules/RuleRegistry";
import Violation from "./Violation";

export default class ScanManager{


    private _nodeTree: any;
    private _parser: Parser;
    private _language: any;
    private _ruleRegistry: any;
    private _sourcePath: string;
    private _sourceCode: string;
    private _violations: Map<string,Array<Violation>>;

    constructor(parser: Parser, language: any,sourcePath: string, sourceCode: string, registry: any){
        this._sourcePath = sourcePath;
        this._sourceCode = sourceCode;
        this._ruleRegistry = registry;
        this._language = language;
        this._parser = parser;
        this._nodeTree = parser.parse(this._sourceCode);
    }

    dump(queryString: string){
        // Use dump as a mechanism to allow for ad-hoc ts queries?
        const result: Array<DumpResult> = [];
        if( queryString === ""){
            queryString = `(class_declaration @decl)`;
        }
        const query : TreeSitter.Query = new TreeSitter.Query(this._language,queryString);
        const matches: TreeSitter.QueryMatch[] = query.matches(this._nodeTree.rootNode)
        for(let match of matches){
            for(let capture of match.captures){
                const dumpResult: DumpResult = new DumpResult(capture.node,this._sourceCode);
                result.push(dumpResult);
            }
        }
        console.log(JSON.stringify(reuslt));
    }
    
    scan():  Map<string,Array<Violation>>{
        return this._scan("scan");
    }

    // (#match? @exp "^[a-zA-Z]{0,3}$")
    private _scan(context: string):  Map<string,Array<Violation>>{
        const tree = this._nodeTree;
        if(RULE_REGISTRY === null || RULE_REGISTRY.rules === null){
        }
        const resultMap: Map<string,Array<Violation>> = new Map<string,Array<Violation>>();
        for(let rule of RULE_REGISTRY.rules){
            if(!resultMap.has(rule.name)){
                resultMap.set(rule.name,[]);
            }
            for(let ruleQuery of rule.queries){
                // First the tree sitter query. :everage the built-in regex
                if(!ruleQuery.context.includes(context)){
                    continue;
                }
                let queryText = ruleQuery.query;
                if(ruleQuery.pattern != null){
                    const regExInsert = `(#match? @exp "${ruleQuery.pattern}")`;
                    queryText = queryText.replace("@exp", regExInsert);
                }
                try{
                    const query : TreeSitter.Query = new TreeSitter.Query(this._language,queryText);
                    const matches: TreeSitter.QueryMatch[] = query.matches(this._nodeTree.rootNode);
                    matches.forEach(match=>{
                        match.captures.forEach(capture=>{
                            let violationFlagged: boolean = true;
                            // Now on to functions
                            if(ruleQuery.function != null){
                                const queryFunction = ruleQuery.function;
                                violationFlagged = queryFunction(capture.node);
                            }
                            if(violationFlagged){
                                const newViolation: Violation = new Violation(capture.node,rule,ruleQuery,this._sourcePath);
                                resultMap[rule.name].push(newViolation);
                            }
                        });
                    });
    
                }
                catch(treeSitterError: any){
                    console.error(`A tree-sitter query error occurred: ${treeSitterError}`);
                }

            }
        }
        return resultMap;
    }

    measure(parser: Parser, language: any){
        return this._scan("measure");
    }
}

class FileMeasurements{
    FilePath: string;
    Measurements: Array<any>;

    constructor(filePath: string){
        this.FilePath = filePath;
        this.Measurements = [];

    }
}

export class DumpResult{
    SourceFragment: string;
    StartIndex: number;
    EndIndex: number;

    constructor(node: SyntaxNode, source: string){
        this.SourceFragment = source.substring(node.startIndex,node.endIndex);
        this.StartIndex = node.startIndex;
        this.EndIndex = node.endIndex;
    }
}