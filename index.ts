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
import { RULE_REGISTRY } from "./rules/RuleRegistry.ts";
const sampleSource : string = `
/**
 * @description Example implementation of an extension from the VTC_BaseRepo
 * @author Booz Allen
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
const startingFromDirectory = "c:/repos/bah/va/team-3/ff/va-teams/force-app/main/default/classes"; // Replace with your directory path

const program = new Command();

program
    .name("SourceLoupe")
    .description("Static analysis with TypeScript and tree-sitter")
    .version("0.0.1");

program
    .option("-r, --recurse","Recursively walk path.")
    .option("-o, --output [fileName]", "Output to file. Type is inferred through the extension. No filename dumps to console.");


program
    .command("scan")
    .description("Scan Apex files in the given source path (recursively.) Apply all rules in order to flag violations.")
    .addArgument(new Argument("sourcePath", "Required. Path to the source being scanned."))
    .action((sourcePath,command)=>{
        run('scan', sourcePath);
    });
program
    .command("dump")
    .description("Dump the raw syntax tree. Primarily for debugging.")
    .addArgument(new Argument("sourcePath", "Required. Path to the source being scanned."))
    .action((sourcePath,command)=>{
        run('dump', sourcePath);
    });
program
    .command("measure")
    .description("Get raw data about source code for analysis.")
    .addArgument(new Argument("sourcePath", "Required. Path to te source being scanned."))
    .action((sourcePath,command)=>{
        run('measure', sourcePath);
    });

    


program.parse(process.argv);
console.log(program.opts());
const options = program.opts();
const recurse = program.opts().recurse ?? false;
function getEverything(dir) {
  const onWindows = process.platform === `win32`;
  const listCommand = onWindows ? `dir /b/o/s "${dir}"` : `find ${dir}`;
  return execSync(listCommand).toString(`utf-8`).split(/\r?\n/);
}

async function readdirRecursive(dir: string): Promise<string[]> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files: string[] = [];
  
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory() && recurse) {
        files.push(...await readdirRecursive(fullPath)); 
      } else {
        files.push(fullPath);
      }
    }
  
    return files;
}

function run(command: string, path: string){

}
function _run(command: string, path: string){
    // Scan config file to handle limiting, global options

    readdirRecursive(path).then(paths=>{
        paths.filter(fileName=>fileName.endsWith(".cls")).forEach(filePath=>{
            fs.readFile(filePath,'utf8')
                .then(fileContents=>{
                    let parser = new Parser();
                    parser.setLanguage(TsSfApex.apex);
                    const scanManager : ScanManager = new ScanManager(filePath,fileContents,RULE_REGISTRY);
                    switch(command){
                        case "scan":
                            scanManager.scan(parser,TsSfApex.apex)
                        case "dump":
                            scanManager.dump(parser,TsSfApex.apex)
                        case "measure":
                            scanManager.measure(parser,TsSfApex.apex)
                    }
            })
    
        });
    })
                
}