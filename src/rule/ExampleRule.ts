import {
    ScanRule,
    RuleSeverity,
    context,
    message,
    name,
    treeQuery,
    suggestion,
    category,
    ruleSeverity,
} from 'cayce-types';

@name('Check for description in the class header comment')
@category('clarity')
@context('scan')
@message('There is no @description tag in the header comment')
@suggestion(
    'Consider adding an appropriate description that adds clarity and context. It helps to include why this class exists, as opposed to what it does.'
)
@ruleSeverity(RuleSeverity.VIOLATION)
@treeQuery('(parser_output(block_comment) @exp(#match? @exp "@description\\*"))')
export class ExampleRule extends ScanRule {}
