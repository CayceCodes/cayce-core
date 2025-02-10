import ScanManager from './core/ScanManager';
import Scanner, { ScannerOptions } from './core/Scanner';
import ScanResult from './results/ScanResult';
import SourceFragment from './results/SourceFragment';
import { ResultType } from './results/ScanResult';
import { ScanRule } from './rule/ScanRule';
import TsSfApex from 'tree-sitter-sfapex';

// eslint-disable-next-line @typescript-eslint/no-namespace, @typescript-eslint/no-unused-vars
declare namespace Sourceloupe {
    export { TsSfApex, ScanManager, Scanner, SourceFragment, ResultType, ScanRule, ScannerOptions, ScanResult };
}
