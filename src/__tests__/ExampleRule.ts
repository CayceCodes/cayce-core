import { ruleSeverity, category, context, message, name, treeQuery, ScanRule, suggestion } from 'cayce-types';
import TsSfApex from 'tree-sitter-sfapex';
import Parser, { Query, QueryCapture } from 'tree-sitter';


@name('Variable, constant or parameter name too short')
@category('codestyle')
@context('measure')
@message('This query returns all variable/parameter/constant names that are under 3 characters in length')
@suggestion('Increase the length of the identifier')
@ruleSeverity(3)
@treeQuery('((variable_declarator name: (identifier)@target)@var)')
export class ExampleRule extends ScanRule {
    TreeSitterLanguage = TsSfApex.apex;

    validate(targetSource: string, parser: Parser): Parser.SyntaxNode[] {
        parser.setLanguage(TsSfApex.apex);
        const rootTree: Parser.Tree = parser.parse(targetSource);
        const queryInstance: Query = new Query(this.TreeSitterLanguage, this.TreeQuery);
        const results: Parser.SyntaxNode[] = [];
        const captures: QueryCapture[] = queryInstance.captures(rootTree.rootNode);
        captures.forEach((capture) => {
            results.push(capture.node);
        });
        return results;
    }
}