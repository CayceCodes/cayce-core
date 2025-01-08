export const RULE_REGISTRY = {
    "rules":
    [
        {
            "name":"Variables",
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

