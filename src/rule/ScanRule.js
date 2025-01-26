export function message(message) {
    return function (target) {
        target.prototype.Message = message;
    };
}
export function name(message) {
    return function (target) {
        target.prototype.Message = message;
    };
}
export function category(category) {
    return function (target) {
        target.prototype.Category = category;
    };
}
export function query(query) {
    return function (target) {
        target.prototype.Query = query;
    };
}
export function regex(regex) {
    return function (target) {
        target.prototype.RegEx = regex;
    };
}
export function suggestion(suggestion) {
    return function (target) {
        target.prototype.Suggestion = suggestion;
    };
}
export function priority(priority) {
    return function (target) {
        target.prototype.Priority = priority;
    };
}
export function context(context) {
    return function (target) {
        target.prototype.Context = context;
    };
}
export class ScanRule {
    validate(node) {
        return true;
    }
    ;
}
//# sourceMappingURL=ScanRule.js.map