import NameLengthRule from "../implementation/NameLengthRule";

export const RULE_REGISTRY = {
    "rules":[{
        "name":"Variable name length",
        "reportedAs":"variable",
        "message":"Variables must be at least three characters long",
        "description":"Concise and clear",
        "instance":new NameLengthRule(),
        "rootNode":"variable_declarator",
        "describingNode":"identifier",
        "arguments":{"minimumLength":3}
    },{
        "name":"Argument name length",
        "reportedAs":"method",
        "message":"Argument names must be at least three characters long",
        "description":"Concise and clear",
        "instance":new NameLengthRule(),
        "rootNode":"formal_parameter",
        "describingNode":"identifier",
        "arguments":{"minimumLength":3}
    }]
}

export const MEASUREMENT_RULES = {
    "rules":
    [
        {
            "name":"variables",
            "queries":[{
                    "name":"Total",
                    "query":'(variable_declarator (identifier) @constant)',
                    "function":null
                },{
                    "name":"Length < 3",
                    "query":'(variable_declarator (identifier) @exp (#match? @exp "^[a-zA-Z]{0,3}$"))',
                    "function":null
                }]
        },
        {
            "name":"Class Declarations",
            "queries":[{
                    "name":"Total",
                    "query":'(class_declaration) @constant',
                    "function":null

                },{
                    "name":"No comment header",
                    "query":'((block_comment) (class_declaration)) @exp',
                    "function":function(node){return node.text.includes("@description")}
                }]
        },
    ]
}

