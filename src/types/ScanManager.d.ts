import Parser from "tree-sitter";
import Violation from "../core/Violation";
import { ScanRule } from "./ScanRule";

export default class ScanManager{
    constructor(parser: Parser, language: any,sourcePath: string, sourceCode: string, rules: Array<ScanRule>);
    scan(): Map<string,Array<Violation>>;
    dump(queryString: string);
    measure(parser: Parser, language: any):  Map<string,Array<Violation>>;
}

