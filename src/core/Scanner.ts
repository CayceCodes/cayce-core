// System imports
import * as fs from 'node:fs/promises';

// Local imports
import ScanManager from '../core/ScanManager.js';
import { ScanRule, ScanResultDigest } from 'cayce-types';

// Third party imports
import Parser from 'tree-sitter';
import type { Language } from 'tree-sitter';

export interface ScannerOptions {
    sourcePath: string;
    rules: ScanRule[];
    overrideQuery?: string;
    language?: Language;
}

export default class Scanner {
    // class properties
    private readonly sourcePath: string;
    private sourceCode = '';
    private readonly rules: ScanRule[];
    private scanManager: ScanManager;
    private readonly parser: Parser;

    /// Static class methods
    /**
     * This is a factory method that will create a new Scanner instance and is the only public way to create a Scanner instance.
     * @param options {ScannerOptions} - The options object that contains the sourcePath, rules, and overrideQuery.
     */
    static async create(options: ScannerOptions): Promise<Scanner> {
        const sourceCode = await Scanner.verifyAndReadFile(options.sourcePath);
        return new Scanner(options, sourceCode);
    }

    private getScanManager(): ScanManager {
        return this.scanManager;
    }

    /// Public methods
    /**
     * @description Private constructor that is called by the `create(...)` singleton static method/
     * @param options This object represents the various options for a scan.
     * Most cases it's sourcePath (the location of the target source) and an array of rules
     * (an array of all rule instances
     * that inherit from ScanRule that we will be applying to the aforementioned source)
     */
    private constructor(options: ScannerOptions, sourceCode: string) {
        this.sourcePath = options.sourcePath;
        this.rules = options.rules;
        this.parser = new Parser();
        this.scanManager = new ScanManager(this.parser, sourceCode, this.rules);
    }

    /**
     * @description Does a standard scan with the rules and target specified in the ScannerOptions on instantiation
     * @retuns A map of scan contexts (usually measure or scan, or both) to scan results.
     * The result object references the rule instance, syntax node,
     * and other related objects for use in getting more detailed information
     */
    public async run(): Promise<ScanResultDigest[]> {
        return await this.scanManager.scan();
    }

    public async measure(): Promise<ScanResultDigest[]> {
        return await this.scanManager.measure();
    }

    // private methods
    private static async verifyAndReadFile(filePath: string): Promise<string> {
        try {
            await fs.access(filePath);
            const contents = await fs.readFile(filePath, 'utf-8');
            return contents.trim();
        } catch (error: unknown) {
            console.error(`Unable to open file at ${filePath} due to ${error as Error}`);
            return Promise.reject(error as Error);
        }
    }
}
