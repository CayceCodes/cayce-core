import TsSfApex from "tree-sitter-sfapex";
import ScanManager from "./ScanManager";
import Parser from "tree-sitter";
import { ScanRule } from "../rule/ScanRule";

export class ScanRunner{
    
    private _sourcePath: string;
    private _sourceCode: string;
    private _rules: Array<ScanRule>;
    private _scanManager: ScanManager;
    private _parser: Parser;
    private _language: any;
    
    constructor(sourcePath: string, sourceCode: string, rules: Array<ScanRule>, language?: any){
        this._parser = new Parser();
        this._parser.setLanguage(TsSfApex.apex);
        this._sourceCode = sourceCode;
        this._sourcePath = sourcePath;
        this._rules = rules;
        this._language = language ?? TsSfApex.apex;
    }

    async execute(command: ScanCommand, queryOverride?: string){
        this._scanManager = new ScanManager(this._parser,this._language,this._sourcePath,this._sourceCode,this._rules);
        switch(command){
            case ScanCommand.DUMP:
                break;
            case ScanCommand.SCAN:
                break;
            case ScanCommand.MEASURE:
                break;
        }
    }
}

export enum ScanCommand{
    DUMP = 0,
    SCAN = 1,
    MEASURE = 2
}