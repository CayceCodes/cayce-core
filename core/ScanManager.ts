import Parser, { Tree, SyntaxNode } from "tree-sitter";
import * as TreeSitter from "tree-sitter";
import { RULE_REGISTRY } from "../rules/RuleRegistry";

export default class ScanManager{

    SourcePath: string;
    SourceCode: string;
    RuleRegistry: any;

    constructor(sourcePath: string, sourceCode: string, registry: any){
        this.SourcePath = sourcePath;
        this.SourceCode = sourceCode;
        this.RuleRegistry = registry;
    }

    dump(parser: Parser, language: any, queryString: string){
        // Use dump as a mechanism to allow for ad-hoc ts queries?
        const tree = parser.parse(this.SourceCode);
        if( queryString === ""){
            queryString = `(class_declaration @mod)`;
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
        this.measure(parser,language);
    }
    measure(parser: Parser, language: any){
        const fileMeasure : FileMeasurements = new FileMeasurements(this.SourcePath);
        const tree = parser.parse(this.SourceCode);
        for(let rule of RULE_REGISTRY.rules){
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
