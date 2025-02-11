/* eslint-disable prettier/prettier */
import { QueryMatch, SyntaxNode } from 'tree-sitter';
import ScanResult from '../results/ScanResult';

// type alias to restrict Function to something that returns a ScanRule
type ScanRuleConstructor = abstract new () => ScanRule;


/**
 * Annotation Reference
 * 
 * @see `message(string)` 
 * A message to be displayed to the user that gives information about the result of applying a rule. This is the "what" and "why" in the conversation
 * 
 * @see `name(string)`
 * A human-readable name for the rule that gives a general sense as to its nature
 * 
 * @see `category(string)`
 * A free-text category that can be leveraged for reporting and organization
 * 
 * @see `query(string)`
 * The tree sitter query that is initially kicked off to find the nodes of interest. The results can be further modified via the preFilter method
 * 
 * @see `regex(string)`
 * A string representation of a simple regular expression that is executed along with an associated ts query. This is the preferred method of using regex in the framwork at this time. It requires no extra work on the part of the scriptiong engine.
 * 
 * @see `suggestion(string)`
 * This is the "how" in the conversation with the user. For example, if a violation is found, how does one go about fixing it, communicating tech debt, or justifying an exception that must be made for it. Provides a call to action for the user.
 * 
 * @see `priority(number)`
 * This corresponds to the numeric value from the ResultType enum in the ScanResult.ts file. The higher the number, the more important the result is. 0-2 are already "named" in the enum for convenience. To the library, a 2 (RuleType.ERROR) and a 3 are the same thing. Values over 2 have thier importance judged by the caretakers of the ruleset.
 * 
 * @see `context(string)`
 * Whether this rule is used to scan for violations and areas for improvement or measuring the quantity of node types for various reporting purposes. It also supports both via a comma: scan,measure is the same as measure,scan.
 * 
 */



export function message(message: string) {
    return function (target: ScanRuleConstructor): void {
        target.prototype.Message = message;
    };
}

export function name(message: string) {
    return function (target: ScanRuleConstructor): void {
        target.prototype.Name = message;
    };
}

export function category(category: string) {
    return function (target: ScanRuleConstructor): void {
        target.prototype.Category = category;
    };
}

export function query(query: string) {
    return function (target: ScanRuleConstructor): void {
        target.prototype.Query = query;
    };
}

export function regex(regex: string) {
    return function (target: ScanRuleConstructor): void {
        target.prototype.RegEx = regex;
    };
}

export function suggestion(suggestion: string) {
    return function (target: ScanRuleConstructor): void {
        target.prototype.Suggestion = suggestion;
    };
}

export function priority(priority: number) {
    return function (target: ScanRuleConstructor): void {
        target.prototype.Priority = priority;
    };
}

export function context(context: string) {
    return function (target: ScanRuleConstructor): void {
        target.prototype.Context = context;
    };
}

export function resultType(resultType: number) {
    return function (target: ScanRuleConstructor): void {
        target.prototype.RuleType = resultType;
    };
}

/**
 * ScanRule is the base class for all rules, whether they are measuring the nodes within a source module or scanning for violations of code quality rules. It provides a handful of methods that can be overloaded for further processing ihe event that a simple query doesn't cover the use case. These methods are executed at different times during the scan lifecycle and as such provide different methods of filtering and/or manipulating the results
 */
export abstract class ScanRule {
    Node!: SyntaxNode;
    ResultType!: number;
    Message!: string;
    Category!: string;
    Priority!: number;
    Suggestion!: string;
    Name!: string;
    Query!: string;
    RegEx!: string;
    Context!: string;

    /**
     * No constructor needed, although this could change going forward
     */
    constructor() {}

    /**
     * preFilter(...) This method provides a structured way to manipulate the set of nodes that are consumed downstream if there is a use case that needs more detailed filtering than the ts query language provides
     * @param _node This is passed the root node that results from the initial tree sitter query by the scan manager
     * @param _sourceFilePath
     */
    preFilter(rawRoot: SyntaxNode): SyntaxNode {
        return rawRoot;
    }

    /**
     * Validate the root tree node that is returned as a result of the initial ts query (after it has gone through the prefilter if it has been overriden) Allows for more complicated use cases that could cover disparate nodes or across multiple files.
     * @param _node The root node that is returned from the initial ts query (prefiltered or not, @see `preFilter()`
     * @returns 
     */
    validateRoot(rootNode: SyntaxNode): ScanResult[] {
        return [];
    }

    /**
     * Validate an array of nodes that have been collected as the result of a tree sitter query; this allows for multi-node inspection and multi-result returns. 
     * @param nodes A collection of nodes that have been returned via a ts query after being optionally filtered via preFilter
     * @returns Array of scan results that correspond to the violations or metrics we are interested in
     */
    validateNodes(_nodes: Array<SyntaxNode>): ScanResult[] {
        return [];
    }

    /**
     * Inspect a single node for either violations or measurements (counting instances, etc.)
     * @param _node A single node that will be inspected and either scanned for violation(s) or measured for metrics
     * @returns Array of ScanResult instances. Returning more than one allows a rule to cover overlapping use cases
     */
    validateNode(_node: SyntaxNode): ScanResult[] {
        return [];
    }

    /**
     * This methods applies to use cases that require simple source code metrics: method counts, argument counts, number of DML operations in a class, etc. Normally, it just would call the internal performCount method that does the basic tallying but it can also perform its own manipulation if needed.
     * @param _nodes A set of nodes that are usually the result of a tree sitter query that apply to some measurement (variable counts, etc.)
     * @returns 
     */
    measureNodes(_nodes: SyntaxNode[]): Map<string,SyntaxNode[]>{
        return new Map<string,SyntaxNode[]>();
    }


    /**
     * This method performs the count that provided the information that a measurement operation would be interested in
     * @param _nodes A set of nodes that are generally passed by the public measureNodes method.
     * @returns A map of node 'grammarType' strings (grammar type is generally the human readable name of the node, like 'identifier' or 'class_declaration') and their corresponding list of nodes with the same grammar type. 
     * 
     * This allows the collection to be used flexibly: grab the array length and the key (grammar type) and you have easy access to the basic counts. Dive further into the array, and you can access the source code location, the descendents, etc.
     */
    private performCount(_nodes: SyntaxNode[]): Map<string,SyntaxNode[]>{
        const resultMap: Map<string,SyntaxNode[]> = new Map<string,SyntaxNode[]>();

        _nodes.forEach(nodeItem=>{
            const resultEntry: SyntaxNode[] = resultMap.get(nodeItem.grammarType) ?? [];
            resultEntry.push(nodeItem);
            resultMap.set(nodeItem.grammarType,resultEntry);
        });
        return resultMap;
    }
}

