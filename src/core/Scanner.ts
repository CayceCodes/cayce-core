// System imports
import * as fs from 'node:fs/promises';

// Local imports
import ScanManager from '../core/ScanManager';
import { ScanRule } from '../rule/ScanRule';

// Third party imports
import TsSfApex from 'tree-sitter-sfapex';
import Parser from 'tree-sitter';
import ScanResult from '../results/ScanResult';
import { SampleRule } from '../rule/SampleRule';
import { Language } from '../core/Language';

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
    /**
     * @description Private constructor that is called by the `create(...)` singleton static method/
     * @param options This object represents the various options for a scan. Most cases it's sourcePath (the location of the target source) and a rules array (an array of all rule instances that inherit from ScanRule that we will be applying to the aforementioned source)
     */
    private constructor(options: ScannerOptions) {
        this.sourcePath = options.sourcePath;
        this.rules = options.rules;
        this.overrideQuery = options.overrideQuery ?? '';
        this.parser = new Parser();
        this.language = TsSfApex.apex;
        this.scanManager = new ScanManager(this.parser, TsSfApex.apex, this.sourceCode, this.rules);
    }

    /**'
     * @description Does a standard scan with the rules and target specified in the ScannerOptions on instantiation
     * @retuns A map of scan contextx (usually measure or scan, or both) to scan resultsl. The results object references the rule instance, syntax node, and other related objects for use in getting more detailed informatioon
     */
    public async run(): Promise<Map<string, ScanResult[]>> {
        return await this.scanManager.scan();
    }

    /**
     * @description A simple dump that is the result of a tree sitter query/s-expression passed in to the method. If no query is specificed, it uses a default query that retrieves the body of a class.
     * @param overrideQuery  If you wish to use a custom query, use it here.
     * @param sourceCode The source to be scanned. Useful when there is a use case for scanning multiple targets for debugging
     * @param language The language to be used for the scan. Defaults to Apex
     */
    public static async debug(overrideQuery: string, sourceCode: string, language?: Language): Promise<string> {
        const scanManager: ScanManager = new ScanManager(new Parser(), language ?? TsSfApex.apex, sourceCode, [
            new SampleRule(sourceCode),
        ]);
        console.log(overrideQuery);
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
