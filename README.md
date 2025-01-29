```
                         _                 
 ___ ___ _ _ ___ ___ ___| |___ _ _ ___ ___ 
|_ -| . | | |  _|  _| -_| | . | | | . | -_|
|___|___|___|_| |___|___|_|___|___|  _|___|
                                  |_|   
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

```javascript
{
    "category":"variables",
    "name":"Some descriptive name",
    "message":"Tell the user what has been flagged, why it's been flagged, and how to fix it.",
    "priority:1,
    "query":"Tree sitter query for defining what we want to inspect.",
    "regex":"A regular expression that further refines the query.",
    "scanFunction":function(node){return node != null;}     // Anonymous function to run against the node
}
```

PRO TIP:

https://aheber.github.io/tree-sitter-sfapex/playground/

This is a great resource.



## Current Usage

In order to get any use out of this thing, you're going to need some rules to give it.
Those rules are defined as JSON/options structures. You can add as many as you want, but the rules collection is locked down as a private variable and only accessible via methods. 

## Notes

Proposed new rule format:


```TypeScript
/*
Two example rules for a proposed design that can use NPM packages

The first one is functional and uses the validate() method to check the length of parameter names. Those parameter names are collected by the tree-sitter query in the @query annotation

The second one is super simple. It uses the regex annotation to find any variable name that has the word "foo" in it. There is no other processing, so the vallidate() method is just a stub

Rules can also inherit from each other, so they can share and chain funcitonality if needed.
*/

@name("Short param names")
@tags("variables","parameters","readability")
@context("scan")
@message("Parameters must have names that are longer than three characters")
@suggestion("To provide clarity to readers, cohsider being as descriptive as possible with variable names wihle remaining clear and concise.")
@priority(1)
@query("((formal_parameter) identifier @expression)")
@regex(null)
class ParameterTooShortRule extends ScanRule{

    // There could also be other methods that shortcut things, like validateText
    // This is a weird example, because I feel like this could easily be a parameterized rule with a spread argument
    validateNode(node: SyntaxNode): boolean{
        if( node.text.length < 4){
            return false;
        }
        return true;
    }
}


@name("Bad pattern")
@tags("variables","readability")
@context("scan")
@message("The word foo is not allowed")
@suggestion("Consider a better name.")
@priority(1)
@query("((variable_declarator) identifier @expression)")
@regex("foo")
class FooNotAllowed extends ScanRule{
    // This is just a stub. The super returns true always
}

```

Tree Sitter Builder...putting it down so I don't lose the thought
```TypeScript

// This is how I see the building for queries in a later rev:

const variableDeclaration = new TreeSitterQueryBuilde("variable_eclarator");
variableDeclaration
    .thatHasChild("identifier")
    .thenUnionWith("formal_parameter")
    .thatHasChild("identifier")
    .combine()
    .thatMatchesPattern("[a-z]");

```

# Query

Description

(parser_output
  (block_comment) @exp
  (#match? @exp "@description*")
)

(class_declaration 
  name: (identifier) @class_name
  (#match? @exp "VATEST?|[A-Z]{2,4})_[a-zA-Z0-9]*")
)

(modifiers
  ((modifier )@mod )
  (#match? @mod "abstract"))


(interface_declaration
  name: (identifier) @class_name
  (#match? @exp "VATEST?|[A-Z]{2,4})_[a-zA-Z0-9]*")
)





        <properties>
            <property
                name="patternOuterClass"
                description="Strongly typed regular expression. Validates that the outer class has a prefix indicating the 'namespace'."
                value="(VATEST?|[A-Z]{2,4})_[a-zA-Z0-9]*" />
            <property
                name="patternTestClass"
                description="Strongly typed regular expression. Validates that the outer class has a prefix indicating the 'namespace'."
                value="(VATEST?|[A-Z]{2,4})_[a-zA-Z0-9]*" />
            <property
                name="patternAbstractClass"
                description="Strongly typed regular expression. Validates that the abstract has a prefix indicating the 'namespace'."
                value="(VATEST?|[A-Z]{2,4})_[a-zA-Z0-9]*" />
            <property
                name="patternInterface"
                description="Strongly typed regular expression. Validates that the interface has a prefix indicating the 'namespace'."
                value="(VATEST?|[A-Z]{2,4})_[a-zA-Z0-9]*" />
            <property
                name="patternInnerClass"
                description="Strongly typed regular expression. Validates that the inner class has no prefix."
                value="[A-Z][a-zA-Z0-9]*" />
        </properties>