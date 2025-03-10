import ScanResult from './scan-result.js';

export enum OutputFormat {
    Sarif,
    Csv,
    Json,
    Xml,
    Sarifv2,
}

export interface Formatter<T> {
    format(scanResults: ScanResult[], outputFormat: T): string;
    supportsOutputFormat(outputFormatType: OutputFormat): boolean;

    getSupportedOutputFormats(): OutputFormat[];

    getName(): string;
}
