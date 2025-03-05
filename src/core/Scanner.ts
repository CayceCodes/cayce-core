// System imports
import * as fs from 'node:fs/promises';

// Local imports
import ScanManager from '../core/ScanManager.js';
import { ScanRule, ScanResult } from 'cayce-types';
import { ExampleRule } from '../rule/ExampleRule.js';

// Third party imports
import Parser from 'tree-sitter';

export interface ScannerOptions {
    sourcePath: string;
    rules: ScanRule[];
    overrideQuery?: string;
}

export default class Scanner {
    // class properties
    private readonly sourcePath: string;
    private sourceCode = '';
    private readonly rules: ScanRule[];
    private scanManager: ScanManager;
    private readonly parser: Parser;
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
    /**
     * @description Private constructor that is called by the `create(...)` singleton static method/
     * @param options This object represents the various options for a scan.
     * Most cases it's sourcePath (the location of the target source) and an array of ScanRules
     * (an array of all rule instances
     * that inherit from ScanRule that we will be applying to the aforementioned source)
     */
    private constructor(options: ScannerOptions) {
        this.sourcePath = options.sourcePath;
        this.rules = options.rules;
        this.overrideQuery = options.overrideQuery ?? '';
        this.parser = new Parser();
        this.scanManager = new ScanManager(this.parser, this.sourceCode, this.rules);
    }

    /**
     * @description Does a standard scan with the rules and target specified in the ScannerOptions on instantiation
     * @retuns A map of scan contexts (usually measure or scan, or both) to scan results.
     * The result object references the rule instance, syntax node,
     * and other related objects for use in getting more detailed information
     */
    public async run(): Promise<ScanResult[]> {
        return await this.scanManager.scan();
    }

    /**
     * @description A simple dump that is the result of a tree sitter query/s-expression passed in to the method.
     * If no query is specified, it uses a default query that retrieves the body of a class.
     * @param overrideQuery If you wish to use a custom query, use it here.
     * @param sourceCode The source to be scanned. Useful when there is a use case for scanning multiple targets for debugging
     */
    public static debug(overrideQuery: string, sourceCode: string): string {
        // @ts-ignore
        const scanManager: ScanManager = new ScanManager(new Parser(), sourceCode, [new ExampleRule()]);
        // console.log(overrideQuery);
        return scanManager.dump(overrideQuery);
    }

    /**
     * Executes a measurement scan on the source code using the configured rules
     * @returns A promise that resolves to an array of ScanResult objects containing measurement results
     * @throws {Error} When the scan manager encounters an error during measurement
     * @public
     */
    public async measure(): Promise<ScanResult[]> {
        return await this.scanManager.measure();
    }

    // private methods
    /**
     * Verifies file existence and reads its contents
     * @param filePath - The full path to the file to be read
     * @returns A promise that resolves to the trimmed contents of the file as a string
     * @throws {Error} When the file cannot be accessed or read
     * @private
     */ private async verifyAndReadFile(filePath: string): Promise<string> {
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
