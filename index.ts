'use strict';
import * as fs from "fs/promises";
import * as path from "path";
import * as TreeSitter from "tree-sitter";
import Parser from "tree-sitter";
import TsSfApex from "tree-sitter-sfapex";
import ScanManager from "./core/ScanManager.ts";
import NameLengthRule from "./rules/implementation/NameLengthRule.ts";
import type ScanRule from "./core/ScanRule.ts";
import {Command,Option,Argument} from "commander";
import { readFile } from "fs";
import { execSync } from "child_process";
import { sourceMapsEnabled } from "process";
import { RULE_REGISTRY } from "./rules/configuration/RuleRegistry.ts";
const sampleSource : string = `
/**
 * @description Example implementation of an extension from the VTC_BaseRepo
 * @author Booz Allen
 *
 * @example
 * public class MyLWCController{
 *  @TestVisible
 *  private static VCR_AccountRepo memoizedAccountRepo;
 *    whitespace change made to test ci
 *
 *    An internally available getter that returns the memoized version if available.
 *    This allows us to only have one instance of the repo at a time
 *
 *  private static VCR_AccountRepo accountRepo {
 *     get {
 *          if (memoizedAccountRepo == null) {
 *                 memoizedAccountRepo = new VCR_AccountRepo();
 *              }
 *            return memoizedAccountRepo;
 *         }
 *     }
 *
 *
 *
 *
 *     @AuraEnabled
 *     public static List<Account> getPersonAccountsForLWC(){
 *         try {
 *             return accountRepo.fetchPersonAccountsWithContactInfo();
 *         } catch (Exception e) {
 *             AuraHandledException except = new AuraHandledException(e.getMessage());
 *
 *             Sets the message so we can check it in  our test classes
 *
 *             except.setMessage(e.getMessage());
 *             throw except;
 *         }
 *     }
 * }
 *
 * Using FetchById with defaultSelectFields
 *  VCR_AccountRepo repo = new VCR_AccountRepo();
 *  List<Account> accounts = repo.fetchById(recordId);
 *
 * Using FetchById with additional fields
 * VCR_AccountRepo repo = new VCR_AccountRepo();
 * Set<String> myAdditionalFields = new Set<String>{'PersonContactId'};
 * List<Account> accs = repo.fetchById(recordId, myAdditionalFields);
 */
public virtual inherited sharing class VCR_AccountRepo extends VTC_BaseRepo {
    /**
     * @description Constructor function for VCR_AccountRepo. Calls super constructor which sets this.sObjectType to 'Account'
     *  Adds additional defaultSelectFields
     */
    public VCR_AccountRepo() {
        super(Account.sObjectType);
        this.defaultSelectFields.add('Name');
    }

    // Other queries can be copy pasted here.

    /**
     * @description Example:
     * @return List<Account> returns a list of Person accounts with contact information.
     */
    public List<Account> fetchPersonAccountsWithContactInfo() {
        String selectClause = 'SELECT ID, FirstName, LastName, PersonContactId, PersonEmail';
        String fromClause = this.calculateFromClause();
        String whereClause = 'WHERE IsPersonAccount = true';
        String query = selectClause + ' ' + fromClause + ' ' + whereClause + ' LIMIT 2000';
        return this.fetch(query);
    }

    /**
     * @description Query via ICN/MVI:
     * @param icns  Set<String> Set of ICNS to query for
     * @return List<Account> returns a list of Person accounts that match the ICN passed in
     */
    public List<Account> fetchPersonAccountsViaICN(Set<String> icns) {
        String selectClause = 'SELECT ID, VCC_Date_of_Birth_Text__pc, VCC_MVI_External_Id__pc';
        String fromClause = this.calculateFromClause();
        String whereClause = 'WHERE VCC_MVI_External_Id__pc IN (' + listClause + ')';
        String query = selectClause + ' ' + fromClause + ' ' + whereClause + ' LIMIT 2000';
        return this.fetch(query);
    }
}
`;

const program = new Command();

program
    .name("SourceLoupe")
    .description("Static analysis with TypeScript and tree-sitter")
    .version("0.0.1")
    
program
    .command("scan <sourcePath>")
    .description("Scan Apex files in the given source path (recursively.) Apply all rules in order to flag violations.")
    .action((sourcePath,Command)=>{
        run("scan", sourcePath);
    });

program
    .command("dump <sourcePath>")
    .description("Dump the raw syntax tree. Primarily for debugging.")
    .action((sourcePath,Command)=>{
        run("dump", sourcePath);
    });

program
    .command("measure <sourcePath>")
    .description("Get raw data about source code for analysis.")
    .action((sourcePath,Command)=>{
        run("measure", sourcePath);
    });

program.parse(process.argv);

function getEverything(dir) {
  const onWindows = process.platform === `win32`;
  const listCommand = onWindows ? `dir /b/o/s "${dir}"` : `find ${dir}`;
  return execSync(listCommand).toString(`utf-8`).split(/\r?\n/);
}

function run(command: string, path: string){
    if(path === "debug"){
        let parser = new Parser();
        parser.setLanguage(TsSfApex.apex);
        const mgr : ScanManager = new ScanManager("debug",sampleSource,RULE_REGISTRY);
        if(command === "scan"){
            mgr.scan(parser,TsSfApex.apex)
        }
        else if(command === "dump"){
            mgr.dump(parser,TsSfApex.apex)
        }
        else if(command === "measure"){
            mgr.measure(parser,TsSfApex.apex)
        }
        return;
    }
    // Scan config file to handle limiting, global options
    const startingFromDirectory = "c:/repos/bah/va/team-3/ff/va-teams/force-app/main/default/classes"; // Replace with your directory path
    //mgr.measure(parser,TsSfApex.apex);
    console.log("Dumping....");
    const allPaths = getEverything(startingFromDirectory);
    for(let fileName of allPaths){
        if(fileName.endsWith('.cls')){
            fs.readFile(fileName,'utf8')
                .then(fileContents=>{
                    let parser = new Parser();
                    parser.setLanguage(TsSfApex.apex);
                    const mgr : ScanManager = new ScanManager(fileName,fileContents,RULE_REGISTRY);
                    mgr.measure(parser,TsSfApex.apex)
            })
        }
    }
                
}