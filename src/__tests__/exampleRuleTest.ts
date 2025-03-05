import Scanner from '../core/Scanner.js';
import { ExampleRule } from '../rule/ExampleRule.js';
import { jest } from '@jest/globals';
import path from 'node:path';

test('Positive test for description', async () => {
    const consoleSpy = jest.spyOn(console, 'error');

    const testFilePath = path.join('./src/__tests__/', 'SampleApex.cls');
    const options = {
        // @ts-ignore
        rules: [new ExampleRule()],
        sourcePath: testFilePath,
    };

    const scanner = await Scanner.create(options);
    const results = await scanner.run();
    expect(results.length).toBeGreaterThanOrEqual(0);
    expect(consoleSpy).not.toHaveBeenCalled();
});
