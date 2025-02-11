import { SyntaxNode } from 'tree-sitter';
import ScanResult, { ResultType } from '../results/ScanResult';
import { context, message, name, priority, query, regex, suggestion, category } from './ScanRule';
import { ScanRule } from './ScanRule';

@name('Check for description in the class header comment')
@category('clarity')
@context('scan')
@message('The name of this method is too short (under three characters)')
@suggestion(
    'A method name should be as descriptive as possible. Consider changing the name to reflect the function and utility of its purpose'
)
@priority(1)
@query('(method_declaration (identifier)@a)')
@regex('')
export class ExampleRule extends ScanRule {
    validateNode(node: SyntaxNode): ScanResult[] {
        const resultList: ScanResult[] = [];
        if (node.text.length < 4) {
            resultList.push(new ScanResult(this, ResultType.VIOLATION, []));
        }

        return resultList;
    }
}
