var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// System imports
import * as fs from 'node:fs/promises';
// Local imports
import ScanManager from './ScanManager';
// Third party imports
import TsSfApex from 'tree-sitter-sfapex';
import Parser from 'tree-sitter';
export default class Scanner {
    /// Static class methods
    /**
     * This is a factory method that will create a new Scanner instance and is the only public way to create a Scanner instance.
     * @param options {ScannerOptions} - The options object that contains the sourcePath, rules, and overrideQuery.
     */
    static create(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const scanner = new Scanner(options);
            scanner.sourceCode = yield scanner.verifyAndReadFile(scanner.sourcePath);
            return scanner;
        });
    }
    /// Public methods
    constructor(options) {
        var _a;
        this.sourcePath = options.sourcePath;
        this.rules = options.rules;
        this.overrideQuery = (_a = options.overrideQuery) !== null && _a !== void 0 ? _a : "";
        this.parser = new Parser();
        this.language = TsSfApex.apex;
        this.scanManager = new ScanManager(this.parser, this.language, this.sourcePath, this.sourceCode, this.rules);
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.scanManager.scan();
        });
    }
    debug() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.scanManager.dump(this.overrideQuery);
        });
    }
    measure() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.scanManager.measure();
        });
    }
    // private methods
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
//# sourceMappingURL=Scanner.js.map