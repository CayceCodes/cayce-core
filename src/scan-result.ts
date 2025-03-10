import { ScanRule } from './scan-rule.js';
import Parser from 'tree-sitter';

/**
 * Represents detailed information about a scan finding, including the rule violated,
 * the location within the source code, and any additional metadata.
 */
export default class ScanResult {
    readonly rule: ScanRule;
    readonly sourceNode: Parser.SyntaxNode;
    readonly metadata: Map<string, string>;
    /**
     * Constructs a ScanResult instance, initializing it with the provided parameters.
     * This is primarily used to capture and report details about scan findings.
     * @param rule The rule that was violated or triggered this scan result.
     * @param targetNode The syntax node in the source code where the issue was found.
     * @param metadata Additional information relevant to the scan result.
     */
    constructor(rule: ScanRule, targetNode: Parser.SyntaxNode, metadata?: Map<string, string>) {
        this.sourceNode = targetNode;
        this.rule = rule;
        this.metadata = metadata ?? new Map<string, string>();
    }
}
