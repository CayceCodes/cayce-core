import TsSfApex from 'tree-sitter-sfapex';
import Scanner from '../core/Scanner.js';
import { ExampleRule } from '../rule/ExampleRule.js';

test('Positive test for description', () => {
    const options = {
        rules: [new ExampleRule('public class Foo{}')],
        sourcePath: './src/__tests__/SampleApex.cls',
        language: TsSfApex.apex,
    };

    Scanner.create(options).then((scanner) => {
        scanner.run().then((results) => {
            expect(results.size).toBeGreaterThan(0);
        });
    });
});
