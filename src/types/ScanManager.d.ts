import Parser from 'tree-sitter';
import Violation from '../core/Violation';
import { ScanRule } from './ScanRule';

export default class ScanManager {
  constructor(parser: Parser, language: Language, sourcePath: string, sourceCode: string, rules: Array<ScanRule>);
  scan(): Map<string, Array<Violation>>;
  /**
   * @description Dump the results of a tree sitter query to the console
   * @param queryString 
   */
  dump(queryString: string);
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  measure(parser: Parser, language: any): Map<string, Array<Violation>>;
}
