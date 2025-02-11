/* eslint-disable prettier/prettier */
import TsSfApex from 'tree-sitter-sfapex';
import Scanner from '../core/Scanner';
import {ExampleRule} from '../rule/ExampleRule';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ScanResult from '../results/ScanResult';

test('Positive test for description', () => {

    //static async create(options: ScannerOptions): Promise<Scanner> {
    
    const options = {
        rules: [new ExampleRule()],
        sourcePath: './src/__tests__/SampleApex.cls',
        language: TsSfApex.apex
    };

    Scanner.create(options)
        .then((scanner)=>{
            scanner.run().then(results=>{
                expect(results.size).toBeGreaterThan(0);
            });
        });

});
