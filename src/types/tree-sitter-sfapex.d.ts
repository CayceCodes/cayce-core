declare module 'tree-sitter-sfapex' {
    interface TsSfApex {
        apex: Language;
        soql: Language;
        sosl: Language;
    }

    const TsSfApex: TsSfApex;
    export default TsSfApex;
}
