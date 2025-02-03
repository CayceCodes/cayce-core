import { SyntaxNode } from 'tree-sitter';
import { ScanRule } from '../rule/ScanRule';

/**
 * Violation class
 * Simple object for providing some structure and behavior to the rule on the subject of parsing
 */
export default class ScanResult {
    Rule: ScanRule;
    SourceNode: SyntaxNode;
    FilePath: string;
    Message: string;

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    _metaData: Array<any>;

    /**
     * constructor
     * @param sourceNode
     * @param rule
     * @param filePath
     * @param metaData
     */
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    constructor(sourceNode: SyntaxNode, rule: ScanRule, filePath: string, ...metaData: Array<any>) {
        this.Rule = rule;
        this.FilePath = filePath;
        this.SourceNode = sourceNode;
        this._metaData = metaData ?? [];

        this.Message = this.Rule.Message;

        for (const element of this._metaData) {
            this.Message = this.Message.replace(`%${element[0]}%`, `${element[1]}`);
        }
    }
}
