/// <reference types="jest" />

import * as treeSitterApex from 'tree-sitter-sfapex';
import Scanner from '../core/Scanner.js';
import { ExampleRule } from './ExampleRule.js';
import { jest } from '@jest/globals';
import ScanManager from '../core/ScanManager.js';

test('Positive test for description', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const options = {
        rules: [new ExampleRule()],
        sourcePath: './src/__tests__/SampleApex.cls',
        language: treeSitterApex.apex,
    };
    console.log(options.sourcePath);
    const scanner = await Scanner.create(options);

    // @ts-ignore
    expect(scanner.getScanManager().getSourceCode()).not.toBe('');

    const values = await scanner.run();
    //.expect(consoleSpy).not.toHaveBeenCalled();

    expect(values.length).toBeGreaterThanOrEqual(1)

});