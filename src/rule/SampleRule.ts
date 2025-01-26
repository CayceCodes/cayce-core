import { context, message, name, priority, query, regex, ScanRule, suggestion, category } from "./ScanRule";

@name("Bad pattern")
@category("clarity")
@context("scan")
@message("The word foo is not allowed")
@suggestion("Consider a better name.")
@priority(1)
@query("((variable_declarator) identifier @expression)")
@regex("foo")
class FooNotAllowed extends ScanRule{
    // This is just a stub. The super returns true always
}