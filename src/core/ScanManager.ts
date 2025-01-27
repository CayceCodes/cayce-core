import Parser, { Tree, SyntaxNode } from "tree-sitter";
import * as TreeSitter from "tree-sitter";
import ScanResult from "./ScanResult";
import { ScanRule } from "../rule/ScanRule";

export default class ScanManager{


    private _nodeTree: any;
    private _parser: Parser;
    private _language: any;
    private _rules: Array<ScanRule>;
    private _sourcePath: string;
    private _sourceCode: string;
    private _violations: Map<string,Array<ScanResult>>;


/*

{
  parser: "foo",
  plugins: ["prettier-plugin-foo"],
});


 */

    constructor(parser: Parser, language: any,sourcePath: string, sourceCode: string, rules: Array<ScanRule>){
        parser.setLanguage(language);
        this._sourcePath = sourcePath;
        this._sourceCode = sourceCode;
        this._rules = rules;
        this._language = language;
        this._parser = parser;
        this._nodeTree = parser.parse(this._sourceCode);
    }

    /**
     * Dump is here as a way to quickly test out new rules without having to create them. It's basically
     * a mini playground.
     * @param queryString A tree sitter query. Can be as simple or as complex as you want.
     */
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
        console.log(JSON.stringify(result));
    }
    

    async measure(parser: Parser, language: any):  Promise<Map<string, ScanResult[]>> {
        return this._scan("measure");
    }

    /**
     * Scan is the scanner scannerific scantaculous main method for inspecting code for violations of given rules.
     * Rules are provided to the ScanManager from elsewhere.
     * TODO: Convert to async. Refactor the private _scan method so that it iterates through a supplied set of rules invoked through a dynamic import
     * @returns A map of cateogries->list of violations
     */
    async scan():  Promise<Map<string, ScanResult[]>>{
        return await this._scan("scan");
    }

    /**
     * Common scan method used by both scan and measure. Both were consolidated here as both essentially
     * did the same thing, just reported the results differently. Realizing that how the report is formatted
     * should be the purview of something other than the scanner, I moved that stuff out.
     * @param context What operational contecxt we are using. Scan or measure are currently supported.
     * @returns `Map<string,Array<ScanResult>>` A map of category->array of violations. Allows for some
     * custom organization
     */
    private async _scan(context: string):  Promise<Map<string, ScanResult[]>>{
        const tree = this._nodeTree;
        if(this._rules === null || this._rules.length === 0){
        }
        const resultMap: Map<string,Array<ScanResult>> = new Map<string,Array<ScanResult>>();

        for(let rule of this._rules){
            if(!resultMap.has(rule.Category)){
                resultMap.set(rule.Category,[]);
            }
            
            // First the tree sitter query. :everage the built-in regex
            if(!rule.Context.includes(context)){
                continue;
            }
            let queryText = rule.Query;
            if(rule.RegEx != null){
                // Note that tree-sitter is persnickity about regular expressions.
                // It's not that great about giving you feedback if the regex is gibbed.
                // Including this here fragment because I know it works...it's just for reference
                // (#match? @exp "^[a-zA-Z]{0,3}$")

                const regExInsert = rule.RegEx == null ? "" : `(#match? @exp "${rule.RegEx}")`;
                queryText += regExInsert;
            }
            try{
                const query : TreeSitter.Query = new TreeSitter.Query(this._language,queryText);
                const matches: TreeSitter.QueryMatch[] = query.matches(this._nodeTree.rootNode);
                matches.forEach(match=>{
                    match.captures.forEach(capture=>{
                        let isValid: boolean = false;
                        isValid = rule.validate(capture.node);
                        if(!isValid){
                            const newScanResult: ScanResult = new ScanResult(capture.node,rule,this._sourcePath);
                            resultMap[rule.Context].push(newScanResult);
                        }
                    });
                });

            }
            catch(treeSitterError: any){
                console.error(`A tree-sitter query error occurred: ${treeSitterError}`);
            }

        }
        return resultMap;
    }
}


/**
 * Simple object for containing information returned from a dump operation. Dump accepts
 * a  tree sitter query and spits back the requested source fragment to the console.
 */
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

const RULE_REGISTRY = 
{
    "rules":
    [
        {
            "name":"Variables",
            "queries":[{
                    "name":"Total",
                    "context":"measure",
                    "message":"This is the total number of variable declarations, not counting method arguments.",
                    "query":'(variable_declarator (identifier) @exp)',
                },
                {
                    "name":"Length < 3",
                    "context":"scan,measure",
                    "message":"Variables should be descriptive, clear, and concise with names over three characters long.",
                    "query":'(variable_declarator (identifier) @exp)',
                    "function":function(node){return node.text.length > 3;}
                },
                {
                    "name":"Trivial RegEx",
                    "context":"scan,measure",
                    "message":"A trivial RegEx (for testing) has produced some matches.",
                    "query":'(variable_declarator (identifier) @exp)',
                    "pattern":"foo_[a-zA-Z0-9]*",
                }

            ]
        }
    ]
}

