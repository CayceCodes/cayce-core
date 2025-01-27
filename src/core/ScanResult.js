/**
 * Violation class
 * Simple object for providing some structure and behavior to the rule on the subject of parsing
 */
export default class ScanResult {
    /**
     * constructor(...) Entry point for new objects.
     * @param node
     * @param rule
     * @param args
     */
    constructor(node, rule, filePath) {
        this.Rule = rule;
        this.FilePath = filePath;
        this.SourceNode = node;
    }
}
//# sourceMappingURL=ScanResult.js.map