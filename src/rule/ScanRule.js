"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScanRule = void 0;
exports.message = message;
exports.name = name;
exports.category = category;
exports.query = query;
exports.regex = regex;
exports.suggestion = suggestion;
exports.priority = priority;
exports.context = context;
exports.ruleType = ruleType;
function message(message) {
    return function (target) {
        target.prototype.Message = message;
    };
}
function name(message) {
    return function (target) {
        target.prototype.Name = message;
    };
}
function category(category) {
    return function (target) {
        target.prototype.Category = category;
    };
}
function query(query) {
    return function (target) {
        target.prototype.Query = query;
    };
}
function regex(regex) {
    return function (target) {
        target.prototype.RegEx = regex;
    };
}
function suggestion(suggestion) {
    return function (target) {
        target.prototype.Suggestion = suggestion;
    };
}
function priority(priority) {
    return function (target) {
        target.prototype.Priority = priority;
    };
}
function context(context) {
    return function (target) {
        target.prototype.Context = context;
    };
}
function ruleType(ruleType) {
    return function (target) {
        target.prototype.RuleType = ruleType;
    };
}
var ScanRule = /** @class */ (function () {
    function ScanRule() {
    }
    /**
     * preFilter(...) As yet unused. This is a hook for filtering out nodes before they are processed.
     * @param _node
     * @param _sourceFilePath
     */
    ScanRule.prototype.preFilter = function (_node, _sourceFilePath) {
        return true;
    };
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    ScanRule.prototype.validateMatches = function (_matches) {
        return [];
    };
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    ScanRule.prototype.validateTree = function (_node) {
        return true;
    };
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    ScanRule.prototype.validate = function (_node) {
        return true;
    };
    return ScanRule;
}());
exports.ScanRule = ScanRule;
