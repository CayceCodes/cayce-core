// index.ts

import Scanner from './core/Scanner';
import { ScannerOptions } from './core/Scanner';
import ScanResult, { ResultType } from './results/ScanResult';
import Langauge from './types/Language';
import { ScanRule, category, context, message, name, priority, query, regex, suggestion } from './rule/ScanRule';

export { ScanRule, Scanner, ScanResult, category, context, message, name, priority, query, regex, suggestion };
export type { ScannerOptions, ResultType, Langauge };
