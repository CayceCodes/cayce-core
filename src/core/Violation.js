"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Violation class
 * Simple object for providing some structure and behavior to the rule on the subject of parsing
 */
var Violation = /** @class */ (function () {
    /**
     * constructor(...) Entry point for new objects.
     * @param node
     * @param rule
     * @param args
     */
    function Violation(node, rule, ruleQuery, filePath) {
        this.RuleQuery = ruleQuery;
        this.FilePath = filePath;
        this.SourceSyntaxNode = node;
    }
    return Violation;
}());
exports.default = Violation;
