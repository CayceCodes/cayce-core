import Parser, { Tree, SyntaxNode } from "tree-sitter";
import * as TreeSitter from "tree-sitter";
<<<<<<< HEAD
import { RULE_REGISTRY } from "../rules/RuleRegistry";
=======
import ViolationAlert from "./ViolationAlert";
import { MEASUREMENT_RULES } from "../rules/configuration/RuleRegistry";
>>>>>>> bad0e45ca6019ee3254ae72bccfe52f5fa16df95

export default class ScanManager{

    SourcePath: string;
    SourceCode: string;
    RuleRegistry: any;
<<<<<<< HEAD
    GrammarParser: Parser;
    GrammarLanguage: any;

    private _nodeTree: any;

    constructor(parser: Parser, language: any,sourcePath: string, sourceCode: string, registry: any){
        this.SourcePath = sourcePath;
        this.SourceCode = sourceCode;
        this.RuleRegistry = registry;
        this._nodeTree = parser.parse(this.SourceCode);
    }

    dump(parser: Parser, language: any, queryString: string){
        // Use dump as a mechanism to allow for ad-hoc ts queries?
        const tree = parser.parse(this.SourceCode);
        if( queryString === ""){
            queryString = `(class_declaration @decl)`;
        }
        console.log(queryString);
        const query : TreeSitter.Query = new TreeSitter.Query(language,queryString);
        const matches: TreeSitter.QueryMatch[] = query.matches(tree.rootNode)
        for(let match of matches){
            for(let capture of match.captures){
                const sourceFragment = this.SourceCode.substring(capture.node.startIndex,capture.node.endIndex);
                console.log(sourceFragment);
            }
        }
    }
    
    scan(parser: Parser, language: any){
        const fileMeasure : FileMeasurements = new FileMeasurements(this.SourcePath);
        this.measure(parser,language);
        const tree = parser.parse(this.SourceCode);
        if(RULE_REGISTRY === null || RULE_REGISTRY.rules === null){
            // Throw custom exception            
        }
        for( let rule in RULE_REGISTRY.rules){

        }
    }

    measure(parser: Parser, language: any){
        const fileMeasure : FileMeasurements = new FileMeasurements(this.SourcePath);
        if(RULE_REGISTRY === null || RULE_REGISTRY.rules === null){
            throw new Error("Rule registry invalid.");
        }
        for(let rule of RULE_REGISTRY.rules){
            const measurement = {}
            measurement[rule.name] = {};
            for(let ruleQuery of rule.queries){
                if(!ruleQuery.context.includes("measure")){
                    continue;
                }
=======
    Alerts: Array<ViolationAlert>;

    constructor(sourcePath: string, sourceCode: string, registry: any){
        this.SourcePath = sourcePath;
        this.SourceCode = sourceCode;
        this.RuleRegistry = registry;
        this.Alerts = [];
    }

    dump(parser: Parser, language: any){
        const tree = parser.parse(this.SourceCode);
        const q : TreeSitter.Query = new TreeSitter.Query(language,`(class_declaration (modifiers (modifier (inherited_sharing)@mod)))`);
        const matches: TreeSitter.QueryMatch[] = q.matches(tree.rootNode)
        q.captures(tree.rootNode);
        for(let m of matches){
            for(let c of m.captures){
                console.log(c.node.text);
            }
        }
    }
    
    scan(parser: Parser, language: any){
        parser.setLanguage(language);
        const sourceTree: Tree = parser.parse(this.SourceCode)
        
        for(let ruleConfig of this.RuleRegistry.rules){
            const describingNodes = sourceTree.rootNode.descendantsOfType(ruleConfig.describingNode);
            let nodesToScan: Array<SyntaxNode> = []
            for(let node of describingNodes){
                if(node.parent.grammarType == ruleConfig.rootNode){
                    nodesToScan.push(node);
                }
            }
        
            if(nodesToScan.length > 0){
                for(let violation of ruleConfig.instance.inspect(nodesToScan,ruleConfig.arguments)){
                    const alertItem: ViolationAlert = new ViolationAlert(violation,ruleConfig);
                    alertItem.StartsAt = violation.TargetNode.startIndex;
                    alertItem.EndsAt = violation.TargetNode.endIndex;
                    this.Alerts.push(alertItem);

                }
            }
            for(let alertItem of this.Alerts){
                const startAt = alertItem.ViolationInstance.TargetNode.startIndex;
                const endAt = alertItem.ViolationInstance.TargetNode.endIndex;
                console.log(this.SourceCode.substring(startAt,endAt));
            }
        }
    }
    measure(parser: Parser, language: any){
        const fileMeasure : FileMeasurements = new FileMeasurements(this.SourcePath);
        const tree = parser.parse(this.SourceCode);
        for(let rule of MEASUREMENT_RULES.rules){
            const measurement = {}
            measurement[rule.name] = {};
            for(let ruleQuery of rule.queries){
>>>>>>> bad0e45ca6019ee3254ae72bccfe52f5fa16df95
                measurement[rule.name][ruleQuery.name] = 0;
                const query : TreeSitter.Query = new TreeSitter.Query(language,ruleQuery.query);
                const matches: TreeSitter.QueryMatch[] = query.matches(tree.rootNode);
                if(ruleQuery.function != null){
                    for(let match of matches){
                        for(let capture of match.captures){
                            let queryFunction = ruleQuery.function
                            if(queryFunction(capture.node) == false){
                                measurement[rule.name][ruleQuery.name]++;
                            }
                        }
                    }
                }
                else{
<<<<<<< HEAD
                    for( let match of matches){
                        for(let capture of match.captures){
                            if(ruleQuery.type === "regex"){
                                const regExSearch = new RegExp(ruleQuery.pattern);
                                const foundArray = regExSearch.exec(capture.node.text);
                                if(foundArray !== null){
                                    measurement[rule.name][ruleQuery.name]+=foundArray.length;
                                }                                
                            }
                            else{
                                measurement[rule.name][ruleQuery.name]++;
                            }
                        }

                    }
=======
                    measurement[rule.name][ruleQuery.name]= matches.length
>>>>>>> bad0e45ca6019ee3254ae72bccfe52f5fa16df95
                }
            }
            fileMeasure.Measurements.push(measurement);
        }
<<<<<<< HEAD
        this.MeasureResult = JSON.stringify(fileMeasure);
=======
        //console.log(JSON.stringify(fileMeasure));
>>>>>>> bad0e45ca6019ee3254ae72bccfe52f5fa16df95
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
