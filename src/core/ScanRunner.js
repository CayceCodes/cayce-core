var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as fs from 'fs/promises';
import TsSfApex from "tree-sitter-sfapex";
import ScanManager from "./ScanManager";
import Parser from "tree-sitter";
export default class ScanRunner {
    constructor(sourcePath, rules, overrideQuery, language) {
        this._parser = new Parser();
        this._parser.setLanguage(TsSfApex.apex);
        this._sourcePath = sourcePath;
        this._rules = rules;
        this._language = language !== null && language !== void 0 ? language : TsSfApex.apex;
        this._overrideQuery = overrideQuery !== null && overrideQuery !== void 0 ? overrideQuery : "";
    }
    execute(command, queryOverride) {
        return __awaiter(this, void 0, void 0, function* () {
            this._scanManager = new ScanManager(this._parser, this._language, this._sourcePath, this._sourceCode, this._rules);
            this._sourceCode = yield this.verifyAndReadFile(this._sourcePath);
            switch (command) {
                case ScanCommand.DUMP:
                    return this._scanManager.dump(this._overrideQuery);
                case ScanCommand.SCAN:
                    return this._scanManager.scan();
                case ScanCommand.MEASURE:
                    return this._scanManager.measure();
            }
        });
    }
    verifyAndReadFile(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield fs.access(filePath);
                const contents = yield fs.readFile(filePath, 'utf-8');
                return contents.trim();
            }
            catch (error) {
                console.error(`Unable to open file at ${filePath}`);
            }
        });
    }
}
export var ScanCommand;
(function (ScanCommand) {
    ScanCommand[ScanCommand["DUMP"] = 0] = "DUMP";
    ScanCommand[ScanCommand["SCAN"] = 1] = "SCAN";
    ScanCommand[ScanCommand["MEASURE"] = 2] = "MEASURE";
})(ScanCommand || (ScanCommand = {}));
//# sourceMappingURL=ScanRunner.js.map