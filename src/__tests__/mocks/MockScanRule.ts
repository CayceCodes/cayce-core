import {
    ruleSeverity,
    category,
    context,
    message,
    name,
    treeQuery,
    ScanRule,
    suggestion,
    id,
    ScanResultDigest,
} from 'cayce-types';

@id('ExampleRule')
@name('Variable, constant or parameter name too short')
@category('codestyle')
@context('measure')
@message('This query returns all variable/parameter/constant names that are under 3 characters in length')
@suggestion('Increase the length of the identifier')
@ruleSeverity(3)
@treeQuery('(parser_output)@target')
export class MockScanRule extends ScanRule {
    willThrow: boolean;
    mockNodes: ScanResultDigest[];

    constructor(willThrow = false, nodes: ScanResultDigest[] = []) {
        super();
        this.willThrow = willThrow;
        this.mockNodes = nodes;
    }

    validate(_sourceCode: string): ScanResultDigest[] {
        if (this.willThrow) {
            throw new Error('Validation error');
        }
        return this.mockNodes;
    }

    getCategory(): string {
        return 'test';
    }

    getName(): string {
        return 'mockRule';
    }

    getDescription(): string {
        return 'Mock rule for testing';
    }
}
