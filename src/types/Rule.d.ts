export default class Rule{
    category: string;
    name: string;
    message: string;
    query: string;
    priority: number;
    context: string;
    example?: string;
    regex?: string;
    scanFunction?: Function;    
}
