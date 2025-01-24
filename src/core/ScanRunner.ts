import ScanManager from "./ScanManager";

export class ScanRunner{
    
    SourceLocations: Array<string>;
    ScanManagerList: Array<ScanManager>;
    CustomRuleLocations: any;

    private _ruleFiles: string;
    
    constructor(sourcePaths: Array<string>, customRuleFilePaths: Array<string>){
        this.SourceLocations = sourcePaths;
        this.CustomRuleLocations = customRuleFilePaths;

    }

    execute(command: ScanCommand, queryOverride: string){
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

enum ScanCommand{
    DUMP,
    SCAN,
    MEASURE
}