export const moduleData = {
    "name":"example",
    "version":"1.0",
    "author":"Group 15 Team",
    "isModuleSource":false
};

export class Module {
    constructor(Handler) {
        document.getElementById("demo").innerHTML = "Module Loaded!";
    }
}
