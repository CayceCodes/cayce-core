import { SyntaxNode } from 'tree-sitter';
import { ScanRule } from '../rule/ScanRule.js';
import SourceFragment from './SourceFragment.js';

export abstract class ScanMetric {
    Result: ResultType;
    SourceNode: SyntaxNode;
    Rule: ScanRule;

    constructor(createdByRule: ScanRule) {
        this.Result = createdByRule.ResultType;
        this.SourceNode = createdByRule.Node;
        this.Rule = createdByRule;
    }
}

/**
 * @description ScanResult class is used to encapsulate various bits of information about a violation or message returned by a scan
 */
export default class ScanResult implements ScanMetric {
    readonly Rule: ScanRule;
    readonly Fragment: SourceFragment;
    readonly SourceNode: SyntaxNode;
    readonly SourceCode: string;
    private metadata: Array<string>;
    readonly Result: ResultType;
    readonly grammarType: string;
    /**
     * constructor Doesn't do anything special other than initialize the various fields
     * @param rule
     * @param resultType
     * @param metadata
     * @see `ScanResult.metadata`
     */
    constructor(rule: ScanRule, resultType: ResultType, metadata?: Array<string>) {
        this.SourceNode = rule.Node;
        this.SourceCode = rule.SourceCode;
        this.Rule = rule;
        this.Fragment = new SourceFragment(rule.Node, this.SourceCode);
        this.metadata = metadata ?? [];
        this.grammarType = rule.Node.grammarType;
        this.Result = ResultType.INFORMATION;
        for (const element of this.metadata) {
            this.Rule.Message = this.Rule.Message.replace(`%${element[0]}%`, `${element[1]}`);
        }
    }
}

export class ScanMeasure extends ScanMetric {
    MeasurementType: ResultType;
    Children: [];

    constructor(createdByRule: ScanRule) {
        super(createdByRule);
        this.Children = [];
        this.MeasurementType = createdByRule.ResultType;
    }
}

/**
 * @description This is used in conjunction with a rule's priority and facilitates filtering and different scan contextx (measure vs. scan, for example) Generally if a priority is above 2, it is considered a violation of escalating importance
 */
export enum ResultType {
    NA,
    INFORMATION,
    WARNING,
    VIOLATION,
}
