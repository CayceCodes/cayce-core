import { Formatter, OutputFormat } from '../formatter.js';
import ScanResult from '../scan-result.js';

export class JsonFormatter implements Formatter<OutputFormat.Json> {
    format(scanResults: ScanResult[], _outputFormat: OutputFormat.Json): string {
        return JSON.stringify(scanResults, null, 2);
    }

    supportsOutputFormat(outputFormatType: OutputFormat): boolean {
        return outputFormatType === OutputFormat.Json;
    }

    getSupportedOutputFormats(): OutputFormat[] {
        return [OutputFormat.Json];
    }

    getName(): string {
        return 'JSON';
    }
}
