// index.ts

import Scanner from './core/Scanner';
import { ScannerOptions } from './core/Scanner';
import { ScanRule } from './rule/ScanRule';
import ScanResult, { ResultType } from './results/ScanResult';
import { context, message, name, priority, query, regex, suggestion, category } from './rule/ScanRule';
import { Language } from './core/Language';

export { ScanRule, Scanner, ScanResult };
export type { Language };
export { context, message, name, priority, query, regex, suggestion, category };
export type { ScannerOptions, ResultType };
