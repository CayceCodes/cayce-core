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
exports.RuleRegistry = exports.DumpResult = void 0;
var TreeSitter = __importStar(require("tree-sitter"));
var Violation_1 = __importDefault(require("./Violation"));
var ScanManager = /** @class */ (function () {
    function ScanManager(parser, language, sourcePath, sourceCode, registry) {
        this._sourcePath = sourcePath;
        this._sourceCode = sourceCode;
        this._ruleRegistry = registry;
        this._language = language;
        this._parser = parser;
        this._nodeTree = parser.parse(this._sourceCode);
    }
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
    ScanManager.prototype.scan = function () {
        return this._scan("scan");
    };
    // (#match? @exp "^[a-zA-Z]{0,3}$")
    ScanManager.prototype._scan = function (context) {
        var _this = this;
        var tree = this._nodeTree;
        if (this._ruleRegistry === null || this._ruleRegistry.getRules() === null) {
        }
        var resultMap = new Map();
        var _loop_1 = function (ruleMapKey) {
            var rule = this_1._ruleRegistry.getRules()[ruleMapKey];
            if (!resultMap.has(rule.category)) {
                resultMap.set(rule.category, []);
            }
            var _loop_2 = function (ruleQuery) {
                // First the tree sitter query. :everage the built-in regex
                if (!ruleQuery.getRules().context.includes(context)) {
                    return "continue";
                }
                var queryText = ruleQuery.query;
                if (ruleQuery.pattern != null) {
                    var regExInsert = "(#match? @exp \"".concat(ruleQuery.pattern, "\")");
                    queryText = queryText.replace("@exp", regExInsert);
                }
                try {
                    var query = new TreeSitter.Query(this_1._language, queryText);
                    var matches = query.matches(this_1._nodeTree.rootNode);
                    matches.forEach(function (match) {
                        match.captures.forEach(function (capture) {
                            var violationFlagged = true;
                            // Now on to functions
                            if (ruleQuery.function != null) {
                                var queryFunction = ruleQuery.function;
                                violationFlagged = queryFunction(capture.node);
                            }
                            if (violationFlagged) {
                                var newViolation = new Violation_1.default(capture.node, rule, ruleQuery, _this._sourcePath);
                                resultMap[rule.category].push(newViolation);
                            }
                        });
                    });
                }
                catch (treeSitterError) {
                    console.error("A tree-sitter query error occurred: ".concat(treeSitterError));
                }
            };
            for (var _b = 0, _c = rule.queries; _b < _c.length; _b++) {
                var ruleQuery = _c[_b];
                _loop_2(ruleQuery);
            }
        };
        var this_1 = this;
        for (var _i = 0, _a = this._ruleRegistry.getRules().keys(); _i < _a.length; _i++) {
            var ruleMapKey = _a[_i];
            _loop_1(ruleMapKey);
        }
        return resultMap;
    };
    ScanManager.prototype.measure = function (parser, language) {
        return this._scan("measure");
    };
    return ScanManager;
}());
exports.default = ScanManager;
var DumpResult = /** @class */ (function () {
    function DumpResult(node, source) {
        this.SourceFragment = source.substring(node.startIndex, node.endIndex);
        this.StartIndex = node.startIndex;
        this.EndIndex = node.endIndex;
    }
    return DumpResult;
}());
exports.DumpResult = DumpResult;
var RuleRegistry = /** @class */ (function () {
    function RuleRegistry() {
    }
    RuleRegistry.prototype.getRules = function () {
        return this._rules;
    };
    /**
     * Adds a rule query. Could use a value object
     * @param category Overall category for the rule. Anything
     * @param name      Name for the query/"inspection"
     * @param context  Either scan, measure or 'scan,measure'
     * @param message What to show the user
     * @param query  Tree sitter query that selects the nodes you want
     * @param scanFunction Anon. function to run against the nodes
     * @param regEx Regular expression to further filter the query
     */
    RuleRegistry.prototype.addRuleQuery = function (category, name, context, message, query, scanFunction, regEx) {
        var ruleDefinition;
        if (this._rules.has(category)) {
            ruleDefinition = this._rules[category];
        }
        else {
            ruleDefinition = new RuleDefinition();
            ruleDefinition.category = category;
            ruleDefinition.queries = [];
        }
        var newQuery = new QueryDefinition();
        newQuery.name = name;
        newQuery.context = context;
        newQuery.message = message;
        newQuery.query = query;
        newQuery.function = scanFunction;
        newQuery.regex = regEx;
        ruleDefinition.queries.push(newQuery);
    };
    return RuleRegistry;
}());
exports.RuleRegistry = RuleRegistry;
var RuleDefinition = /** @class */ (function () {
    function RuleDefinition() {
    }
    return RuleDefinition;
}());
var QueryDefinition = /** @class */ (function () {
    function QueryDefinition() {
    }
    return QueryDefinition;
}());
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
