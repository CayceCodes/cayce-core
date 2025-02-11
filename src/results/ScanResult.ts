import { SyntaxNode } from 'tree-sitter';
import { ScanRule } from '../rule/ScanRule';
import SourceFragment from './SourceFragment';

/**
 * @description ScanResult class is used to encapsulate various bits of information about a violation or message returned by a scan
 */
export default class ScanResult {
    readonly Rule: ScanRule;
    readonly Fragment: SourceFragment;
    readonly SourceNode: SyntaxNode;
    readonly SourceCode: string;
    private metadata: Array<string>;
    readonly Type: ResultType;

    /**
     * constructor Doesn't do anything special other than initialize the various fields
     * @param sourceNode
     * @param rule
     * @param filePath
     * @param metaData
     */
    constructor(rule: ScanRule, resultType: ResultType, metadata?: Array<string>) {
        this.SourceNode = rule.Node;
        this.SourceCode = rule.SourceCode;
        this.Rule = rule;
        this.Type = resultType;
        this.Fragment = new SourceFragment(rule.Node, this.SourceCode);
        this.metadata = metadata ?? [];

        for (const element of this.metadata) {
            this.Rule.Message = this.Rule.Message.replace(`%${element[0]}%`, `${element[1]}`);
        }
    }
}

/**
 * @description This is used in conjunction with a rule's priority and facilitates filtering and different scan contextx (measure vs. scan, for example) Generally if a priority is above 2, it is considered a violation of escalating importance
 */
export enum ResultType {
    INFORMATION,
    WARNING,
    VIOLATION,
}
