import { SyntaxNode } from 'tree-sitter';
import { ScanRule } from '../rule/ScanRule';
import SourceFragment from './SourceFragment';

/**
 * @description ScanResult class is used to store various bits of information about a violation or message returned by a scan
 */
export default class ScanResult {
    readonly Rule: ScanRule;
    readonly Fragment: SourceFragment;
    readonly SourceNode: SyntaxNode;
    readonly SourceCode: string;
    private _metadata: Array<string>;
    readonly Type: ResultType;

    /**
     * constructor Doesn't do anything special other than initialize the various fields
     * @param sourceNode
     * @param rule
     * @param filePath
     * @param metaData
     */
    constructor(rule: ScanRule, sourceCode: string, resultType: ResultType, metadata?: Array<string>) {
        this.SourceNode = rule.Node;
        this.Rule = rule;
        this.Type = resultType;
        this.SourceCode = sourceCode;
        this.Fragment = new SourceFragment(rule.Node, this.SourceCode);
        this._metadata = metadata ?? [];

        for (const element of this._metadata) {
            this.Rule.Message = this.Rule.Message.replace(`%${element[0]}%`, `${element[1]}`);
        }
    }
}

export enum ResultType {
    INFORMATION,
    WARNING,
    VIOLATION,
}
