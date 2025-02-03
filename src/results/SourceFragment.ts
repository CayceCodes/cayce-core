import { SyntaxNode } from 'tree-sitter';

export default class SourceFragment {
    readonly StartPosition: SourcePosition;
    readonly EndPosition: SourcePosition;
    readonly RawFragment: string;

    constructor(sourceNode: SyntaxNode, rawSource: string) {
        this.StartPosition = new SourcePosition(
            sourceNode.startIndex,
            sourceNode.startPosition.row,
            sourceNode.startPosition.column
        );
        this.EndPosition = new SourcePosition(
            sourceNode.endIndex,
            sourceNode.endPosition.row,
            sourceNode.endPosition.column
        );
        this.RawFragment = rawSource.substring(sourceNode.startIndex, sourceNode.endIndex);
    }
}

export class SourcePosition {
    readonly Index: number;
    readonly Line: number;
    readonly Column: number;
    constructor(index: number, line: number, column: number) {
        this.Index = index;
        this.Line = line;
        this.Column = column;
    }
}
