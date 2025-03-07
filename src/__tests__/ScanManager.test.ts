import Parser from 'tree-sitter';
import { ScanResult } from 'cayce-types';
import ScanManager from '../core/ScanManager.js';
import TreeSitter from 'tree-sitter';
import TsSfApex from 'tree-sitter-sfapex';
import { MockScanRule } from './mocks/MockScanRule.js';
import { jest } from '@jest/globals';

describe('ScanManager', () => {
    let parser: Parser;
    let tree: Parser.Tree;
    let rootNode: Parser.SyntaxNode;
    const consoleSpy = jest.spyOn(console, 'error');
    //.mockImplementation(() => {});

    beforeEach(() => {
        parser = new Parser();
        parser.setLanguage(TsSfApex.apex);
        tree = parser.parse(sampleCode);
        rootNode = tree.rootNode;
    });

    const sampleCode = `
        public class TestClass {
            private String name;
            
            public TestClass() {
                this.name = 'test';
            }
            
            public String getName() {
                return this.name;
            }
        }
    `;

    describe('constructor', () => {
        it('should create a ScanManager instance with valid parameters', () => {
            const manager = new ScanManager(parser, sampleCode, [new MockScanRule()]);
            expect(manager).toBeInstanceOf(ScanManager);
        });
    });

    describe('dump', () => {
        it('should return JSON string of language node type info', () => {
            const manager = new ScanManager(parser, sampleCode, []);
            const mockLanguage = { nodeTypeInfo: { types: ['type1', 'type2'] } } as unknown as TreeSitter.Language;
            const result = manager.dump(mockLanguage);
            expect(JSON.parse(result)).toEqual({ types: ['type1', 'type2'] });
        });
    });

    describe('measure', () => {
        it('should return empty array when no source code is provided', async () => {
            const manager = new ScanManager(parser, '', [new MockScanRule()]);
            const results = await manager.measure();
            expect(results).toEqual([]);
        });

        it('should return empty array when no rules are provided', async () => {
            const manager = new ScanManager(parser, sampleCode, []);
            const results = await manager.measure();
            expect(results).toEqual([]);
        });

        it('should return scan results for valid input', async () => {
            const rule = new MockScanRule(false, rootNode.children);
            const manager = new ScanManager(parser, sampleCode, [rule]);
            const results = await manager.measure();
            expect(results).toHaveLength(1);
            expect(results[0]).toBeInstanceOf(ScanResult);
        });

        it('should handle multiple rules', async () => {
            const mockNodes = ['(class_declaration) @class'] as unknown as Parser.SyntaxNode[];
            const rules = [new MockScanRule(false, mockNodes), new MockScanRule(false, mockNodes)];
            const manager = new ScanManager(parser, 'source code', rules);
            const results = await manager.measure();
            expect(results).toHaveLength(2);
        });
    });

    describe('scan', () => {
        it('should return empty array when no source code is provided', async () => {
            const manager = new ScanManager(parser, '', [new MockScanRule()]);
            const results = await manager.scan();
            expect(results).toEqual([]);
        });

        it('should return empty array when no rules are provided', async () => {
            const manager = new ScanManager(parser, 'source code', []);
            const results = await manager.scan();
            expect(results).toEqual([]);
        });

        it('should return scan results for valid input', async () => {
            const rule = new MockScanRule(false, rootNode.children);
            const manager = new ScanManager(parser, sampleCode, [rule]);
            const results = await manager.scan();
            expect(results).toHaveLength(1);
            expect(results[0]).toBeInstanceOf(ScanResult);
        });

        it('should handle rule validation errors gracefully', async () => {
            const rules = [
                new MockScanRule(true), // This rule throws
                new MockScanRule(false), // This rule succeeds
            ];
            const manager = new ScanManager(parser, 'source code', rules);
            const results = await manager.scan();
            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('Tree-sitter query error in rule MockScanRule:'),
                expect.any(Error)
            );
            expect(results).toHaveLength(0);
            consoleSpy.mockRestore();
        });

        it('should process multiple rules in parallel', async () => {
            const rules = [new MockScanRule(false, rootNode.children), new MockScanRule(false, rootNode.children)];
            const manager = new ScanManager(parser, 'source code', rules);
            const results = await manager.scan();
            expect(results).toHaveLength(2);
        });
    });

    describe('error handling', () => {
        it('should log errors and continue processing when a rule throws', async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
                console.log('bounced to log');
            });
            const rules = [new MockScanRule(true), new MockScanRule(false, rootNode.children)];
            const manager = new ScanManager(parser, 'source code', rules);
            const results = await manager.scan();

            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('Tree-sitter query error in rule MockScanRule:'),
                expect.any(Error)
            );
            expect(results).toHaveLength(1);

            consoleSpy.mockRestore();
        });
    });
});
