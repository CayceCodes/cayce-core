"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SampleRule_1 = require("./rule/SampleRule");
var tree_sitter_sfapex_1 = require("tree-sitter-sfapex");
var foo = new SampleRule_1.SampleRule();
// //constructor(parser: Parser, language: Language, sourcePath: string, sourceCode: string, rules: Array<ScanRule>) {
//
var code = "\npublic class Foo{\n\n    private String bar = '';\n\n}";
//
var options = {
    sourcePath: 'foo',
    rules: [foo],
    overrideQuery: '',
    language: tree_sitter_sfapex_1.default.apex,
};
// //public static async debug(overrideQuery: string, sourceCode: string): Promise<void> {
// Scanner.debug('(variable_declarator (identifier)@foo) @bar', code);
