import TsSfApex from 'tree-sitter-sfapex';
import NodeType from './NodeType';
import TsSfApex from 'tree-sitter-sfapex';

export default interface Language extends TsSfApex.Language {
    name: string;
    nodeTypeInfo: NodeType[];
}
