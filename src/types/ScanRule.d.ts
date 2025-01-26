import { SyntaxNode } from "tree-sitter";

export abstract class ScanRule {

    Node: SyntaxNode;
    Message: string;
    Category: string;
    Priority: number;
    Suggestion: string;
    Name: string;
    Query: string;
    RegEx: string;
    Context: string;

    validate(node: SyntaxNode): boolean;

}  