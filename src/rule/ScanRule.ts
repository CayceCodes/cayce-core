import { QueryMatch, SyntaxNode } from 'tree-sitter';

// type alias to restrict Function to something that returns a ScanRule
type ScanRuleConstructor = abstract new () => ScanRule;

export function message(message: string) {
    return function (target: ScanRuleConstructor): void {
        target.prototype.Message = message;
    };
}

export function name(message: string) {
    return function (target: ScanRuleConstructor): void {
        target.prototype.Name = message;
    };
}

export function category(category: string) {
    return function (target: ScanRuleConstructor): void {
        target.prototype.Category = category;
    };
}

export function query(query: string) {
    return function (target: ScanRuleConstructor): void {
        target.prototype.Query = query;
    };
}

export function regex(regex: string) {
    return function (target: ScanRuleConstructor): void {
        target.prototype.RegEx = regex;
    };
}

export function suggestion(suggestion: string) {
    return function (target: ScanRuleConstructor): void {
        target.prototype.Suggestion = suggestion;
    };
}

export function priority(priority: number) {
    return function (target: ScanRuleConstructor): void {
        target.prototype.Priority = priority;
    };
}

export function context(context: string) {
    return function (target: ScanRuleConstructor): void {
        target.prototype.Context = context;
    };
}

export function ruleType(ruleType: string) {
    return function (target: ScanRuleConstructor): void {
        target.prototype.RuleType = ruleType;
    };
}

export abstract class ScanRule {
    Node!: SyntaxNode;
    RuleType!: string;
    Message!: string;
    Category!: string;
    Priority!: number;
    Suggestion!: string;
    Name!: string;
    Query!: string;
    RegEx!: string;
    Context!: string;

    /**
     * preFilter(...) As yet unused. This is a hook for filtering out nodes before they are processed.
     * @param _node
     * @param _sourceFilePath
     */
    preFilter(_node: SyntaxNode, _sourceFilePath: string): boolean {
        return true;
    }

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    validateMatches(_matches: Array<any>): any {
        return [];
    }

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    validateTree(_node: QueryMatch[]): any {
        return true;
    }

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    validate(_node: SyntaxNode): any {
        return true;
    }
}
