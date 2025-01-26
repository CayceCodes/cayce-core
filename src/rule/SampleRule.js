var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { context, message, name, priority, query, regex, ScanRule, suggestion, category } from "./ScanRule";
let SampleRule = class SampleRule extends ScanRule {
};
SampleRule = __decorate([
    name("Bad pattern"),
    category("clarity"),
    context("scan"),
    message("The word foo is not allowed"),
    suggestion("Consider a better name."),
    priority(1),
    query("((variable_declarator) identifier @expression)"),
    regex("foo")
], SampleRule);
export default SampleRule;
//# sourceMappingURL=SampleRule.js.map