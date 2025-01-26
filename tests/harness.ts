import TsSfApex from "tree-sitter-sfapex";
import ScanManager from "../src/types/ScanManager";
import Parser from "tree-sitter";
import SampleRule from "../src/rule/SampleRule";

//constructor(parser: Parser, language: any,sourcePath: string, sourceCode: string, rules: Array<Rule>);


const source: string = `
public with sharing class TestHarnessApex{
    private String firstNameField = '';
    
    public FirstName{
        get{
            return firstNameField;
        }
        set(String value){
            firstNameField = value;
        }
    }

    public Integer myMethod(Integer firstInt){
        return firstInt * 2;
    }
}`;

    // {
    //     plugins: ["sampleloupe"],
    // }



const parser: Parser = new Parser();
const path: string = `C:\\repos\\sourceloupe\\tests\\`;
const manager: ScanManager = new ScanManager(parser, TsSfApex.apex, path, source, ["sampleloupe"]);