import { Formatter, OutputFormat } from '../formatter.js';
import ScanResult from '../scan-result.js';

export class SarifFormatter implements Formatter<OutputFormat.Sarif | OutputFormat.Sarifv2> {
    format(scanResults: ScanResult[], _outputFormat: OutputFormat.Sarif | OutputFormat.Sarifv2): string {
        // This is a placeholder for the actual SARIF formatting logic
        // You would need to implement the conversion of scanResults to SARIF format here
        const sarifObject = {
            $schema: 'https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json',
            version: '2.1.0',
            runs: [
                {
                    tool: {
                        driver: {
                            name: 'Cayce',
                            informationUri: 'https://github.com/cayce/cayce-core',
                            rules: [],
                        },
                    },
                    results: scanResults.map((result) => ({
                        // Convert each ScanResult to a SARIF result object
                        // This is just an example and should be adjusted based on your ScanResult structure
                        ruleId: result,
                        message: {
                            text: result.rule.Name,
                        },
                        locations: [
                            {
                                physicalLocation: {
                                    artifactLocation: {
                                        uri: '', //result.sourceNode,
                                    },
                                    region: {
                                        startLine: '', //result.sourceNode,
                                    },
                                },
                            },
                        ],
                    })),
                },
            ],
        };

        return JSON.stringify(sarifObject, null, 2);
    }

    supportsOutputFormat(outputFormatType: OutputFormat): boolean {
        return outputFormatType === OutputFormat.Sarif || outputFormatType === OutputFormat.Sarifv2;
    }

    getSupportedOutputFormats(): OutputFormat[] {
        return [OutputFormat.Sarif, OutputFormat.Sarifv2];
    }

    getName(): string {
        return 'SARIF';
    }
}
