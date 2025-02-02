// System imports
import * as fs from 'node:fs/promises';

// Local imports
import ScanManager from './ScanManager.js';
import { ScanRule } from '../rule/ScanRule.js';

// Third party imports
import TsSfApex from 'tree-sitter-sfapex';
import Parser from 'tree-sitter';
import ScanResult from './ScanResult.js';
import { SampleRule } from '../rule/SampleRule.js';

export interface ScannerOptions {
    sourcePath: string;
    rules: Array<ScanRule>;
    overrideQuery?: string;
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    language?: any;
}

export default class Scanner {
    // class properties
    private readonly sourcePath: string;
    private sourceCode: string = '';
    private readonly rules: Array<ScanRule>;
    private scanManager: ScanManager;
    private readonly parser: Parser;
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    private readonly language: any; // I hate having to use any here. ugh.
    private readonly overrideQuery: string;

    /// Static class methods
    /**
     * This is a factory method that will create a new Scanner instance and is the only public way to create a Scanner instance.
     * @param options {ScannerOptions} - The options object that contains the sourcePath, rules, and overrideQuery.
     */
    static async create(options: ScannerOptions): Promise<Scanner> {
        const scanner = new Scanner(options);
        scanner.sourceCode = await scanner.verifyAndReadFile(scanner.sourcePath);
        return scanner;
    }

    /// Public methods
    private constructor(options: ScannerOptions) {
        this.sourcePath = options.sourcePath;
        this.rules = options.rules;
        this.overrideQuery = options.overrideQuery ?? '';
        this.parser = new Parser();
        this.language = TsSfApex.apex;
        this.scanManager = new ScanManager(this.parser, this.language, this.sourcePath, this.sourceCode, this.rules);
    }

    public async run(): Promise<Map<string, ScanResult[]>> {
        return await this.scanManager.scan();
    }

    public static async debug(overrideQuery: string, sourceCode: string): Promise<string> {
        const scanManager: ScanManager = new ScanManager(new Parser(), TsSfApex.apex, 'foo', sourceCode, [
            new SampleRule(),
        ]);

        return scanManager.dump(overrideQuery);
    }

    public async measure(): Promise<Map<string, ScanResult[]>> {
        return await this.scanManager.measure();
    }

    // private methods
    private async verifyAndReadFile(filePath: string): Promise<string> {
        try {
            await fs.access(filePath);
            const contents = await fs.readFile(filePath, 'utf-8');
            return contents.trim();
        } catch (error: unknown) {
            console.error(`Unable to open file at ${filePath} due to ${error}`);
        }
        return Promise.reject('Unable to open file');
    }
}
