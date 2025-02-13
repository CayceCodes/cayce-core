// index.ts

import Scanner from './core/Scanner.js';
import { ScannerOptions } from './core/Scanner.js';
import ScanResult, { ResultType } from './results/ScanResult.js';
import { ScanRule, category, context, message, name, priority, query, regex, suggestion } from './rule/ScanRule.js';

export {
    ScanRule,
    Scanner,
    ScanResult,
    ResultType,
    category,
    context,
    message,
    name,
    priority,
    query,
    regex,
    suggestion,
};
export type { ScannerOptions };
