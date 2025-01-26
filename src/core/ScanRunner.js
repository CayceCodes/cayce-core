export class ScanRunner {
    constructor(sourcePaths, customRuleFilePaths) {
        this.SourceLocations = sourcePaths;
        this.CustomRuleLocations = customRuleFilePaths;
    }
    execute(command, queryOverride) {
        switch (command) {
            case ScanCommand.DUMP:
                break;
            case ScanCommand.SCAN:
                break;
            case ScanCommand.MEASURE:
                break;
        }
    }
}
var ScanCommand;
(function (ScanCommand) {
    ScanCommand[ScanCommand["DUMP"] = 0] = "DUMP";
    ScanCommand[ScanCommand["SCAN"] = 1] = "SCAN";
    ScanCommand[ScanCommand["MEASURE"] = 2] = "MEASURE";
})(ScanCommand || (ScanCommand = {}));
//# sourceMappingURL=ScanRunner.js.map