// index.ts

import Scanner from './core/Scanner';
import { ScannerOptions } from './core/Scanner';
import { ScanRule } from './rule/ScanRule';
import ScanResult, { ResultType } from './results/ScanResult';
import Langauge from './types/Language';

export { ScanRule, Scanner, ScanResult };
export type { ScannerOptions, ResultType, Langauge };
