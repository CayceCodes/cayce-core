import { SampleRule } from './rule/SampleRule.js';
import TsSfApex from 'tree-sitter-sfapex';
import Scanner from './core/Scanner.js';
const foo: SampleRule = new SampleRule();

// //constructor(parser: Parser, language: Language, sourcePath: string, sourceCode: string, rules: Array<ScanRule>) {
//
var code = `
public class Foo{

    private String bar = '';

}`;
//
// var options = {
//     sourcePath: 'foo',
//     rules: [foo],
//     overrideQuery: '',
//     language: TsSfApex.apex,
// };
// //public static async debug(overrideQuery: string, sourceCode: string): Promise<void> {
Scanner.debug('(variable_declarator (identifier)@foo) @bar', code).then((arr: string) => {
    console.log(arr);
    ["@bar=bar = ''","@foo=bar"]
});
