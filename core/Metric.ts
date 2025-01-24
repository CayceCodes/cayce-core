export class Metric{
    Category: string;
    Name: string;
    Message: string;
    Count: number;

    constructor(category: string, violationList: any){
        this.Category = category;
        const violationMap: boolean = false;
        for(let violation in violationList){

        }
    }
}