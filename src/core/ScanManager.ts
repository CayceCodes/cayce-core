import Parser, { Tree, SyntaxNode } from "tree-sitter";
import * as TreeSitter from "tree-sitter";
import Violation from "./Violation";

export default class ScanManager{


    private _nodeTree: any;
    private _parser: Parser;
    private _language: any;
    private _ruleRegistry: any;
    private _sourcePath: string;
    private _sourceCode: string;
    private _violations: Map<string,Array<Violation>>;

    constructor(parser: Parser, language: any,sourcePath: string, sourceCode: string, registry: RuleRegistry){
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
        console.log(JSON.stringify(result));
    }
    
    scan():  Map<string,Array<Violation>>{
        return this._scan("scan");
    }

    // (#match? @exp "^[a-zA-Z]{0,3}$")
    private _scan(context: string):  Map<string,Array<Violation>>{
        const tree = this._nodeTree;
        if(this._ruleRegistry === null || this._ruleRegistry.getRules() === null){
        }
        const resultMap: Map<string,Array<Violation>> = new Map<string,Array<Violation>>();
        for(let ruleMapKey of this._ruleRegistry.getRules().keys()){
            const rule: RuleDefinition = this._ruleRegistry.getRules()[ruleMapKey];
            if(!resultMap.has(rule.category)){
                resultMap.set(rule.category,[]);
            }
            for(let ruleQuery of rule.queries){
                // First the tree sitter query. :everage the built-in regex
                if(!ruleQuery.getRules().context.includes(context)){
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
                                resultMap[rule.category].push(newViolation);
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

    measure(parser: Parser, language: any):  Map<string,Array<Violation>> {
        return this._scan("measure");
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

export class RuleRegistry{
    private _rules: Map<string,RuleDefinition>;
    
    getRules(): Map<string,RuleDefinition>{
        return this._rules;
    
    }
    
    /**
     * Adds a rule query. Could use a value object
     * @param category Overall category for the rule. Anything
     * @param name      Name for the query/"inspection"
     * @param context  Either scan, measure or 'scan,measure'
     * @param message What to show the user
     * @param query  Tree sitter query that selects the nodes you want
     * @param scanFunction Anon. function to run against the nodes
     * @param regEx Regular expression to further filter the query
     */
    addRuleQuery(category: string, name: string, context: string, message: string,query: string, scanFunction?: any, regEx?: string){
        let ruleDefinition: RuleDefinition

        if(this._rules.has(category)){
            ruleDefinition = this._rules[category];
        }
        else{
            ruleDefinition = new RuleDefinition();
            ruleDefinition.category = category;
            ruleDefinition.queries = [];
        }

        const newQuery: QueryDefinition = new QueryDefinition();
        newQuery.name = name;
        newQuery.context = context;
        newQuery.message = message;
        newQuery.query = query;
        newQuery.function = scanFunction;
        newQuery.regex = regEx;
        
        ruleDefinition.queries.push(newQuery);
    }

}

class RuleDefinition{
    queries: any;
    category: string;
}

class QueryDefinition{
    name: string;
    context: string;
    message: string;
    query: string;
    regex: string;
    function: any;
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

