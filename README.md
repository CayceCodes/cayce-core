```
 _ ___ ___ _ _ ___ ___ ___ 
| |_ -| . | | |  _|  _| -_|
| |___|___|___|_|_|___|___|
| | . | | | . | -_|
| |___|___|  _|___|
|___________|     

```
# sourceloupe

A straightforward TypeScript framework for leveraging tree-sitter and tree-sitter-sfapex as a static analysis tool.

This is a work in progress. As such, the API will change as will the purpose of the modules herein.

As things take shape, some clear benefits are coming into focus. These benefits address some of the pain points I've found with other Static Code Analysis tools. This is what I've observed:

* Because the context of an inspection is defined by a tree sitter query instead of a strongly-typed visitor class, there is no need for any franework code.  The structure of the code is defined by and exists through the tree-sitter query and the code itself. This eliminates any coupling issues and abstractions that can get in the way of a unified development model for multiple languages.

* Since it's in TypeScript, ECMAscript can be leveraged as a further mechanism for identifying violations. If a tree sitter query can't identify what you are looking for, script has you covered with endless possiblities.

* Regular expressions can be implemented natively within tree-sitter queries. This means that they can occur at the same time as the query, within the same processing context. No need for any further script logic.

* If there are any concurrency issues, they can be solved through aynchronous operations.

* Tree-sitter is popular among NeoVim and Emacs adherents as a method for the editor to comprehend a language in real time, uncompiled, and incomplete. This means it has to be fast, and the target source doesn't even have to be programmatically valid.

* There is an opportunity for improvement in the rule configuration mechanism. So far, it's a monolithic registry. That should move to something more flexible and user defined.

* Need to find out what node to start from when you're trying to identify an issue? Tree-sitter playgrounds have you covered.

* Did I mention that it's stupid fast? It's stupid fast.

## Rules

The rules are stored (currently) in ./rules/RuleRegistry.ts. This will change, as it's probably nicer to allow a custom ruleset to be passed in. As long as the rules stay simple.

Here are a few annotated example rules that are collected into a "variables" category:

```typescript
{
    "rules":
    [
        {
            // The "name" here is for organizational purposes so rules can be
            // categorized logically
            "name":"Variables",
            
            // Rules are made up of a series of queries, because at the 
            // bare-metal level all rules start with a tree sitter query
            // in order to collect the nodes that are interesting to them.
            "queries":[{
                    // Query name, can be anything
                    "name":"Total",
                    "context": "measure",
                    // There are two raw 'types' of query: treesitter and regex
                    // Regex still uses tree sitter. This may change; the "type"
                    // just be a function of what you supply
                    "message":"Total number of variables",
                    // A tree sitter query.
                    "query":'(variable_declrator (identifier) @exp)',
                    // Optional JS anonymous function. If it returns false, then the test failed
                    "function":null,
                    "regex": null
                },
                {
                    "name":"Length < 3",
                    "context": "measure,scan",
                    "message": "Variable names must be longer than three characters",
                    // THese are the three mechanisms used to identify violations.
                    // Query is required, as it's the fundamental method of getting you the right syntax node(s)
                    // Function is an anonymous function that returns true (no violation) or false (violation)
                    // Regex is an optional regular expression pattern that can further narrow in on an important context. If it finds matches, it flags a violation
                    "query":'(variable_declarator (identifier) @exp)',
                    "function":function(node){return node.text.length > 3;},
                    "regex": null
                },
                {
                    "name":"Trivial RegEx",
                    "message":"This code is bananas!",
                    "query":'(variable_declarator (identifier) @exp)',
                    "pattern":"foo_[a-zA-Z0-9]*",
                    "function":null
                }

            ]
        }
    ]
}

```

PRO TIP:

https://aheber.github.io/tree-sitter-sfapex/playground/

This is a great resource.



## Current Usage
```
Usage: bun index.ts [command] [options]

Static analysis with TypeScript and tree-sitter

Options:
  -V, --version         output the version number
  -r,--recurse          Recursively walk path.
  -h, --help            display help for command

Commands:
  scan <sourcePath>     Scan Apex files in the given source path (recursively.) Apply all rules in order to flag
                        violations.
  dump <sourcePath>     Dump the raw syntax tree. Primarily for debugging.
  measure <sourcePath>  Get raw data about source code for analysis.
  help [command]        display help for command
```
 
