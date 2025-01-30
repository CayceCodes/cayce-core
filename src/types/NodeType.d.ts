export default interface NodeType {
    type: string;
    named: boolean;
    subtypes: NodeType[] | undefined;
}

