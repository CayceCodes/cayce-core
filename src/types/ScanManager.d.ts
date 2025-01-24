import Parser from "tree-sitter";
import Violation from "../core/Violation";

export default class ScanManager{
    scan(): Map<string,Array<Violation>>;
    dump(queryString: string);
    measure(parser: Parser, language: any):  Map<string,Array<Violation>>;
}

