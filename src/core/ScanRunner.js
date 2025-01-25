"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScanRunner = void 0;
var ScanRunner = /** @class */ (function () {
    function ScanRunner(sourcePaths, customRuleFilePaths) {
        this.SourceLocations = sourcePaths;
        this.CustomRuleLocations = customRuleFilePaths;
    }
    ScanRunner.prototype.execute = function (command, queryOverride) {
        switch (command) {
            case ScanCommand.DUMP:
                break;
            case ScanCommand.SCAN:
                break;
            case ScanCommand.MEASURE:
                break;
        }
    };
    return ScanRunner;
}());
exports.ScanRunner = ScanRunner;
var ScanCommand;
(function (ScanCommand) {
    ScanCommand[ScanCommand["DUMP"] = 0] = "DUMP";
    ScanCommand[ScanCommand["SCAN"] = 1] = "SCAN";
    ScanCommand[ScanCommand["MEASURE"] = 2] = "MEASURE";
})(ScanCommand || (ScanCommand = {}));
