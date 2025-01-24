```
 __  __      __  __  ___ 
/__`/  \|  ||__)/  `|__  
.__/\__/\__/|  \\__,|___ 
     __      __  ___     
|   /  \|  ||__)|__      
|___\__/\__/|   |___     
                         
```
# sourceloupe

A straightforward TypeScript framework for leveraging tree-sitter and tree-sitter-sfapex as a static analysis tool.

This is a work in progress. As such, the API will change as will the purpose of the modules herein.


## Rules

<<<<<<< HEAD
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
                    // There are two raw 'types' of query: treesitter and regex
                    // Regex still uses tree sitter. This may change; the "type"
                    // just be a function of what you supply
                    "type":"treesitter",
                    // A tree sitter query.
                    "query":'(variable_declrator (identifier) @exp)',
                    // Optional JS anonymous function. If it returns false, then the test failed
                    "function":null
                },
                {
                    "name":"Length < 3",
                    "type":"treesitter",
                    "query":'(variable_declarator (identifier) @exp)',
                    "function":function(node){return node.text.length > 3;}
                },
                {
                    "name":"Trivial RegEx",
                    "query":'(variable_declarator (identifier) @exp)',
                    "pattern":"foo_[a-zA-Z0-9]*",
                    "type":"regex",
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


=======
Currently, the rules are getting a bit of an overhaul. A better understanding of the tree-sitter query dialect helps. The current direction leverages those queries with optional anonymous functions that can operate at the node level. This provides some flexibility for more complicated/involved use cases.

The direction is also moving towards a "rule registry." This registry is a seperate file with a dictionary containing all the rules and how they operate. Currently there are two registries: one for scan rules and one for measurements. This will change after nailing down a proper report format.
>>>>>>> bad0e45ca6019ee3254ae72bccfe52f5fa16df95

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
 
