import TsSfApex from 'tree-sitter-sfapex';
import NodeType from './NodeType';

export default interface Language extends TsSfApex.Language {
    name: string;
    nodeTypeInfo: NodeType[];
}
