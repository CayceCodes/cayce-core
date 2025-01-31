import TsSfApex from "tree-sitter-sfapex";

import ScanManager from "../src/core/ScanManager";

import {describe, expect, test} from '@jest/globals';


test("Should fail", () => {
    const apexCode = 'public class Foo{ public Foo(Account acct){}}';
    const scanManager = new ScanManager(TsSfApex.apex,"test",apexCode,null);
    console.log(scanManager.dump("(class_declaration(identifier)@id)"));
});