import Parser, { Tree, SyntaxNode } from "tree-sitter";
import * as TreeSitter from "tree-sitter";
import ViolationAlert from "./ViolationAlert";
import { MEASUREMENT_RULES } from "../rules/configuration/RuleRegistry";

export default class ScanManager{

    SourcePath: string;
    SourceCode: string;
    RuleRegistry: any;
    Alerts: Array<ViolationAlert>;

    constructor(sourcePath: string, sourceCode: string, registry: any){
        this.SourcePath = sourcePath;
        this.SourceCode = sourceCode;
        this.RuleRegistry = registry;
        this.Alerts = [];
    }

    dump(parser: Parser, language: any){
        console.log("DUMP");
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
                    measurement[rule.name][ruleQuery.name]= matches.length
                }
            }
            fileMeasure.Measurements.push(measurement);
        }
        console.log(JSON.stringify(fileMeasure));
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
