import * as fs from 'fs/promises';

import TsSfApex from "tree-sitter-sfapex";
import ScanManager from "./ScanManager";
import Parser from "tree-sitter";
import { ScanRule } from "../rule/ScanRule";

export default class ScanRunner{
    
    private _sourcePath: string;
    private _sourceCode: string;
    private _rules: Array<ScanRule>;
    private _scanManager: ScanManager;
    private _parser: Parser;
    private _language: any;
    private _overrideQuery: string;
    
    constructor(sourcePath: string, rules: Array<ScanRule>, overrideQuery: string, language?: any){
        this._parser = new Parser();
        this._parser.setLanguage(TsSfApex.apex);
        this._sourcePath = sourcePath;
        this._rules = rules;
        this._language = language ?? TsSfApex.apex;
        this._overrideQuery = overrideQuery ?? "";
    }

    async execute(command: ScanCommand, queryOverride?: string){
        this._scanManager = new ScanManager(this._parser,this._language,this._sourcePath,this._sourceCode,this._rules);
        this._sourceCode = await this.verifyAndReadFile(this._sourcePath);
        switch(command){
            case ScanCommand.DUMP:
                return this._scanManager.dump(this._overrideQuery);
            case ScanCommand.SCAN:
                return this._scanManager.scan();
            case ScanCommand.MEASURE:
                return this._scanManager.measure();
        }
    }

    private async verifyAndReadFile(filePath: string): Promise<string>{
        try {
            await fs.access(filePath);
            const contents = await fs.readFile(filePath, 'utf-8');
            return contents.trim();
        } catch (error) {
            console.error(`Unable to open file at ${filePath}`);
        }

    }

}

export enum ScanCommand{
    DUMP = 0,
    SCAN = 1,
    MEASURE = 2
}