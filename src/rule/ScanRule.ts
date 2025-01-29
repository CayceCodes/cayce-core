import { SyntaxNode } from "tree-sitter";

export function message(message: string) {
    return function (target: Function) {
        target.prototype.Message = message;
    };
}

export function name(message: string) {
    return function (target: Function) {
        target.prototype.Message = message;
    };
}


export function category(category: string) {
    return function (target: Function) {
        target.prototype.Category = category;
    };
}

export function query(query: string) {
    return function (target: Function) {
        target.prototype.Query = query;
    }
}

export function regex(regex: string) {
    return function (target: Function) {
        target.prototype.RegEx = regex;
    }
}

export function suggestion(suggestion: string) {
    return function (target: Function) {
        target.prototype.Suggestion = suggestion;
    };
}

export function priority(priority: number) {
    return function (target: Function) {
        target.prototype.Priority = priority;
    };
}

export function context(context: string) {
    return function (target: Function) {
        target.prototype.Context = context;
    };
}

export function ruleType(ruleType: string){
    return function (target: Function) {
        target.prototype.RuleType = ruleType;
    }
}

export abstract class ScanRule {

    Node: SyntaxNode;
    RuleType: string;
    Message: string;
    Category: string;
    Priority: number;
    Suggestion: string;
    Name: string;
    Query: string;
    RegEx: string;
    Context: string;

    preFilter(node: SyntaxNode, sourceFilePath: string): boolean{
        return true;
    }

    validateMatches(matches: Array<any>): any{
        return [];
    }

    validateTree(node: QueryMatch[]): any{
        return true;
    };

    validate(node: SyntaxNode): any{
        return true;
    };

}   
