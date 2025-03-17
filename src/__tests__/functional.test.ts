/// <reference types="jest" />
/* eslint-disable @typescript-eslint/no-empty-function */

import * as treeSitterApex from 'tree-sitter-sfapex';
import Scanner from '../core/Scanner.js';
import { ExampleRule } from './ExampleRule.js';
import { jest } from '@jest/globals';

test('Positive test for description', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const options = {
        rules: [new ExampleRule()],
        sourcePath: './src/__tests__/SampleApex.cls',
        language: treeSitterApex.apex,
    };

    const scanner = await Scanner.create(options);
    // @ts-expect-error getScanManager is private
    expect(scanner.getScanManager().getSourceCode()).not.toBe('');
    const values = await scanner.run();
    expect(consoleSpy).not.toHaveBeenCalled();

    expect(values.length).toBeGreaterThanOrEqual(1)

});