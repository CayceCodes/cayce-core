// index.ts

import Scanner from './core/Scanner';
import { ScannerOptions } from './core/Scanner';
import { ScanRule } from './rule/ScanRule';
import ScanResult, { ResultType } from './results/ScanResult';
import Language from './types/Language';
import { context, message, name, priority, query, regex, suggestion, category } from './rule/ScanRule';

export { ScanRule, Scanner, ScanResult };
export { context, message, name, priority, query, regex, suggestion, category };
export type { ScannerOptions, ResultType, Language };
