import { manager as _manager } from "../core/ScanManager.js";

test("Should fail", () => {
    _manager = new ScanManager();
    
    expect(_manager.dump)
});