import Parser from 'tree-sitter';
import { ScanRule } from 'cayce-types';

export class MockScanRule extends ScanRule {
    willThrow: boolean;
    mockNodes: Parser.SyntaxNode[];

    constructor(willThrow = false, nodes: Parser.SyntaxNode[] = []) {
        super();
        this.willThrow = willThrow;
        this.mockNodes = nodes;
    }

    validate(_sourceCode: string, _parser: Parser): Parser.SyntaxNode[] {
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
