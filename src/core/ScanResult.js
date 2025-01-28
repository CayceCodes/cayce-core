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
    constructor(sourceNode, rule, filePath, ...metaData) {
        this.Rule = rule;
        this.FilePath = filePath;
        this.SourceNode = sourceNode;
        ;
        this._metaData = metaData !== null && metaData !== void 0 ? metaData : [];
        this.Message = this.Rule.Message;
        for (let element of this._metaData) {
            this.Message = this.Message.replace(`%${element[0]}%`, `${element[1]}`);
        }
    }
}
//# sourceMappingURL=ScanResult.js.map