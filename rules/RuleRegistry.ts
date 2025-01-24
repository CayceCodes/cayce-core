/**
 * Query fields:
 * "name"       - Human readable, will be displayed as a general description of the rule
 * "message"    - Human readable, this is the suggested call to action to fix a flagged violation
 * "context"    - Right now this is either "scan", "measure" or "scan,measure". It indicates what context the rule should run in. Useful if you want sum totals of tokens that don't involve violations
 * "query"      - This is the tree sitter query. It can be rudimentary, just selecting a single node type that can be further processed by the "function" and "pattern" operations
 * "function"   - Optional. This is an anonymous JavaScruot function that receives the tree sitter node that we are checking and returns true or false. False indicates that a violation has been found. This is powerful, as you can traverse the source tree up and down using the provided node reference.
 * "regex"      - Optional. This is a regular expression that will flag a violation if there are any matches in the node we are inspecting.
 */


export const RULE_REGISTRY = 
{
    "rules":
    [
        {
            "name":"Variables",
            "queries":[{
                    "name":"Total",
                    "context":"measure",
                    "message":"This is the total number of variable declarations, not counting method arguments.",
                    "query":'(variable_declarator (identifier) @exp)',
                },
                {
                    "name":"Length < 3",
                    "context":"scan,measure",
                    "message":"Variables should be descriptive, clear, and concise with names over three characters long.",
                    "query":'(variable_declarator (identifier) @exp)',
                    "function":function(node){return node.text.length > 3;}
                },
                {
                    "name":"Trivial RegEx",
                    "context":"scan,measure",
                    "message":"A trivial RegEx (for testing) has produced some matches.",
                    "query":'(variable_declarator (identifier) @exp)',
                    "pattern":"foo_[a-zA-Z0-9]*",
                }

            ]
        }
    ]
}

