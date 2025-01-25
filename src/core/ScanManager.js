"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DumpResult = void 0;
var TreeSitter = __importStar(require("tree-sitter"));
var Violation_1 = __importDefault(require("./Violation"));
var ScanManager = /** @class */ (function () {
    function ScanManager(parser, language, sourcePath, sourceCode, rules) {
        this._sourcePath = sourcePath;
        this._sourceCode = sourceCode;
        this._rules = rules;
        this._language = language;
        this._parser = parser;
        this._nodeTree = parser.parse(this._sourceCode);
    }
    /**
     * Dump is here as a way to quickly test out new rules without having to create them. It's basically
     * a mini playground.
     * @param queryString A tree sitter query. Can be as simple or as complex as you want.
     */
    ScanManager.prototype.dump = function (queryString) {
        // Use dump as a mechanism to allow for ad-hoc ts queries?
        var result = [];
        if (queryString === "") {
            queryString = "(class_declaration @decl)";
        }
        var query = new TreeSitter.Query(this._language, queryString);
        var matches = query.matches(this._nodeTree.rootNode);
        for (var _i = 0, matches_1 = matches; _i < matches_1.length; _i++) {
            var match = matches_1[_i];
            for (var _a = 0, _b = match.captures; _a < _b.length; _a++) {
                var capture = _b[_a];
                var dumpResult = new DumpResult(capture.node, this._sourceCode);
                result.push(dumpResult);
            }
        }
        console.log(JSON.stringify(result));
    };
    /**
     * Scan is the scanner scannerific scantaculous main method for inspecting code for violations of given rules.
     * Rules are provided to the ScanManager from elsewhere.
     * @returns A map of cateogries->list of violations
     */
    ScanManager.prototype.scan = function () {
        return this._scan("scan");
    };
    /**
     * Common scan method used by both scan and measure. Both were consolidated here as both essentially
     * did the same thing, just reported the results differently. Realizing that how the report is formatted
     * should be the purview of something other than the scanner, I moved that stuff out.
     * @param context What operational contecxt we are using. Scan or measure are currently supported.
     * @returns `Map<string,Array<Violation>>` A map of category->array of violations. Allows for some
     * custom organization
     */
    ScanManager.prototype._scan = function (context) {
        var _this = this;
        var tree = this._nodeTree;
        if (this._rules === null || this._rules.length === 0) {
        }
        var resultMap = new Map();
        var _loop_1 = function (rule) {
            if (!resultMap.has(rule.category)) {
                resultMap.set(rule.category, []);
            }
            // First the tree sitter query. :everage the built-in regex
            if (!rule.context.includes(context)) {
                return "continue";
            }
            var queryText = rule.query;
            if (rule.regex != null) {
                // Note that tree-sitter is persnickity about regular expressions.
                // It's not that great about giving you feedback if the regex is gibbed.
                // Including this here fragment because I know it works...it's just for reference
                // (#match? @exp "^[a-zA-Z]{0,3}$")
                var regExInsert = rule.regex == null ? "" : "(#match? @exp \"".concat(rule.regex, "\")");
                queryText += regExInsert;
            }
            try {
                var query = new TreeSitter.Query(this_1._language, queryText);
                var matches = query.matches(this_1._nodeTree.rootNode);
                matches.forEach(function (match) {
                    match.captures.forEach(function (capture) {
                        var violationFlagged = true;
                        // Now on to functions
                        if (rule.scanFunction != null) {
                            var queryFunction = rule.scanFunction;
                            violationFlagged = queryFunction(capture.node);
                        }
                        if (violationFlagged) {
                            var newViolation = new Violation_1.default(capture.node, rule, _this._sourcePath);
                            resultMap[rule.category].push(newViolation);
                        }
                    });
                });
            }
            catch (treeSitterError) {
                console.error("A tree-sitter query error occurred: ".concat(treeSitterError));
            }
        };
        var this_1 = this;
        for (var _i = 0, _a = this._rules; _i < _a.length; _i++) {
            var rule = _a[_i];
            _loop_1(rule);
        }
        return resultMap;
    };
    ScanManager.prototype.measure = function (parser, language) {
        return this._scan("measure");
    };
    return ScanManager;
}());
exports.default = ScanManager;
/**
 * Simple object for containing information returned from a dump operation. Dump accepts
 * a  tree sitter query and spits back the requested source fragment to the console.
 */
var DumpResult = /** @class */ (function () {
    function DumpResult(node, source) {
        this.SourceFragment = source.substring(node.startIndex, node.endIndex);
        this.StartIndex = node.startIndex;
        this.EndIndex = node.endIndex;
    }
    return DumpResult;
}());
exports.DumpResult = DumpResult;
var RULE_REGISTRY = {
    "rules": [
        {
            "name": "Variables",
            "queries": [{
                    "name": "Total",
                    "context": "measure",
                    "message": "This is the total number of variable declarations, not counting method arguments.",
                    "query": '(variable_declarator (identifier) @exp)',
                },
                {
                    "name": "Length < 3",
                    "context": "scan,measure",
                    "message": "Variables should be descriptive, clear, and concise with names over three characters long.",
                    "query": '(variable_declarator (identifier) @exp)',
                    "function": function (node) { return node.text.length > 3; }
                },
                {
                    "name": "Trivial RegEx",
                    "context": "scan,measure",
                    "message": "A trivial RegEx (for testing) has produced some matches.",
                    "query": '(variable_declarator (identifier) @exp)',
                    "pattern": "foo_[a-zA-Z0-9]*",
                }
            ]
        }
    ]
};
