import { SyntaxNode } from "tree-sitter";

export default class NodeRecognizer{

    InspectedNode: SyntaxNode;

    constructor(inspectedNode: SyntaxNode){
        this.InspectedNode = inspectedNode;
    }
    isVariable(): boolean{
        const parentGrammarType = this.InspectedNode.parent.grammarType;
        const thisGrammarType = this.InspectedNode.grammarType;
        return thisGrammarType == "identifier" && (
            parentGrammarType == "variable_declarator" || 
            parentGrammarType == "formal_parameter"
        );
    }
    isMethod(): boolean{
        const parentGrammarType = this.InspectedNode.parent.grammarType;
        const thisGrammarType = this.InspectedNode.grammarType;
        return thisGrammarType == "identifier" && parentGrammarType.startsWith("method");
    }


}