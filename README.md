```
                         _
 ___ ___ _ _ ___ ___ ___| |___ _ _ ___ ___
|_ -| . | | |  _|  _| -_| | . | | | . | -_|
|___|___|___|_| |___|___|_|___|___|  _|___|
                                  |_|
```

# sourceloupe

A straightforward TypeScript solution that leverages tree-sitter as the parsing backbone for rules-based static code analysis.

This is a work in progress. As such, the API will change as will the purpose of the modules herein.

## Current status:

* So far, around 50+ rules have been completed for the initial Salesforce Apex language plugin. These rules have been gathered from personal experience and the open source PMD project.
* Working on getting a functional prototype to scan a large codebase (~2000 Apex classes)
* Refactored the scanner from the initial design. "query-only" rules are easier to define and are the preferred method of capturing nodes.
* Because the tree-sitter queries are going to take a more active role in defining rules, expect new tutorials that walk through the structure and implementation of these queries.
* Thanks to @codefriar, the initial chaos has been stabilized and domesticated. What started as a humble proof of concept is evolving into a proper solution.

## Coming Soon (under 7 days)
* Refactor targeted for completion and publishing within the next two days, with the back end codebase to be relatively static moving forward (not calling it a code freeze.)
* CLI working in tandem with  the initial sourceloupe-plugin-apex module.
* Demonstration and docummentation of performance metrics will follow.

## On the Horizon
* Add LWC-as-a-language-plugin support
* Refine, refine, refine internals.
* A simple fluent builder library that provides natural-sounding logical methods for building tree sitter queries. This will help with the paren-heavy syntax.
* Better documentation
* Integrate with `sf scan` ?

## Over the Horizon
* Build out as many language plugins as possible.
* Native formatting support (aka prettier) 

