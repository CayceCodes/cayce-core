import { Formatter, OutputFormat } from '../formatter.js';
import { JSONObject } from '../json-object.js';
import ScanResult from '../scan-result.js';

export class XmlFormatter implements Formatter<OutputFormat.Xml> {
    format(scanResults: ScanResult[], _outputFormat: OutputFormat.Xml): string {
        const jsonString = JSON.stringify({ scanResults }, null, 2);
        return this.jsonToXml(JSON.parse(jsonString) as JSONObject);
    }

    supportsOutputFormat(outputFormatType: OutputFormat): boolean {
        return outputFormatType === OutputFormat.Xml;
    }

    getSupportedOutputFormats(): OutputFormat[] {
        return [OutputFormat.Xml];
    }

    getName(): string {
        return 'XML';
    }

    private jsonToXml(obj: JSONObject): string {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += this.parseObject(obj);
        return xml;
    }

    private parseObject(obj: JSONObject, indent = ''): string {
        let xml = '';
        for (const key in obj) {
            if (Array.isArray(obj[key])) {
                xml += `${indent}<${key}>\n`;
                for (const item of obj[key]) {
                    // xml += this.parseObject(item, indent + '  ');
                    if (typeof item === 'object' && item !== null) {
                        xml += this.parseObject(item as JSONObject, indent + '  ');
                    } else {
                        xml += `${indent}  <item>${this.escapeXml(String(item))}</item>\n`;
                    }
                }
                xml += `${indent}</${key}>\n`;
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                xml += `${indent}<${key}>\n`;
                xml += this.parseObject(obj[key], indent + '  ');
                xml += `${indent}</${key}>\n`;
            } else {
                xml += `${indent}<${key}>${this.escapeXml(String(obj[key]))}</${key}>\n`;
            }
        }
        return xml;
    }

    private escapeXml(unsafe: string): string {
        return unsafe.replace(/[<>&'"]/g, (c) => {
            switch (c) {
                case '<':
                    return '&lt;';
                case '>':
                    return '&gt;';
                case '&':
                    return '&amp;';
                case "'":
                    return '&apos;';
                case '"':
                    return '&quot;';
            }
            return c;
        });
    }
}
