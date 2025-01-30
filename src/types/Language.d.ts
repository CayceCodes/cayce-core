import NodeType from "./NodeType";

export default interface Language {
    name: string;
    nodeTypeInfo: NodeType[];
}