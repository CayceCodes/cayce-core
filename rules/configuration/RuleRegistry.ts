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
            "category":"variables",
            "metrics":[{
                "name":"All Variables",
                "type":"count",
                "source-token":"variables",
                "filter":null,
                "advanced":null
            },
            {
                "name":"Variable Names Three Characters or Less",
                "type":"count",
                "source-token":"variable_declarator",
                "filter":"identifier;length;<=3",
                "advanced":null
            },
            ,
            {
                "name":"Variable Names Three Characters or Less",
                "type":"count",
                "source-token":"variable_declarator",
                "filter":"identifier;regex;[a-z][A-Z]",
                "advanced":null
            }]
        },
        {
            "category":"logging",
            "metrics":[{
                "name":"Error Logging",
                "type":"count",
                "source-token":"method_invocation",
                "filter":"text;regex;Logger\.error\(",
                "advanced":null
            },
            {
                "name":"Code Must Not Use System.debug(...)",
                "type":"count",
                "source-token":"method_invocation",
                "filter":"text;regex;System\.debug\(",
                "advanced":null
            }]
        },
        {
            "category":"Documentation",
            "metrics":[{
                "name":"Block Documentation Comments",
                "type":"count",
                "source-token":"block_comment",
                "filter":null,
                "advanced":null
            },
            {
                "name":"Block Documentation Comments Without Descriptions",
                "type":"count",
                "source-token":"block_comment",
                "filter":"text;not-contains;@description",
                "advanced":null
            }]
        }


    ]
}


//System\.debug\((.*?)\);