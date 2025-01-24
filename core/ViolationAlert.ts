import ScanRule from "./ScanRule";
import Violation from "./Violation";

export default class ViolationAlert{
    Message: string;
    Description: string;
    SourceFilePath: string
    ViolationInstance: Violation;
    StartsAt: number;
    EndsAt: number;
    Rule: ScanRule;

    constructor(violation: Violation, configuration: any){
        this.Message = configuration["message"];
        this.Description = configuration["description"];
        this.ViolationInstance = violation;
        this.Rule = violation.ScanRuleUsed;
    }

    getSourceFragment(rawSource: string): string{
        const fragment = rawSource.substring(this.ViolationInstance.TargetNode.startIndex,this.ViolationInstance.TargetNode.endIndex);
        return fragment;
    }
}