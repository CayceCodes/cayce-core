import { ruleSeverity, category, context, message, name, treeQuery, ScanRule, suggestion, id } from 'cayce-types';
import TsSfApex from 'tree-sitter-sfapex';
import { ScanResultDigest } from 'cayce-types';

@id('ExampleRule')
@name('Variable, constant or parameter name too short')
@category('codestyle')
@context('measure')
@message('This query returns all variable/parameter/constant names that are under 3 characters in length')
@suggestion('Increase the length of the identifier')
@ruleSeverity(3)
@treeQuery('((variable_declarator name: (identifier)@target)@var)')
export class ExampleRule extends ScanRule {
    TreeSitterLanguage = TsSfApex.apex;

    validate(targetSource: string): ScanResultDigest[] {
        return super.validate(targetSource);
    }
}
