export class QueryBuilder{
    private _initialNodeType : string;

    private _nodeList : Array<string>;

    constructor(initialNodeType : string){
        this._initialNodeType = init
    }

    public addChild(childType : string, childName : string = "@exp" ) : void{


    }


}


class NodeLink{
    private _type : string;
    private _name : string;

    private _next : NodeLink;


    constructor(type : string, name : string){
        this._type = type;
        this._name = name;
    }

    addNext(nodeLink : NodeLink) : NodeLink{
        this._next = nodeLink;
        return this._next;
    }

    toString(){
        return `(${this._type}) @${this._name}`;
    }
}