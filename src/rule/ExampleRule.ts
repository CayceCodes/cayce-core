//(parser_output(block_comment) @exp(#match? @exp "@description\*"))
import { context, message, name, priority, query, regex, suggestion, category } from './ScanRule';
import { ScanRule } from './ScanRule';

@name('Check for descripition in the class header comment')
@category('clarity')
@context('scan')
@message('There is no @description tag in the header comment')
@suggestion(
    'Consider adding an appropriate description that adds clarity and context. It helps to include why this class exists, as opposed to what it does.'
)
@priority(1)
@query('(parser_output(block_comment) @exp(#match? @exp "@description\\*"))')
@regex('')
export class ExampleRule extends ScanRule {}