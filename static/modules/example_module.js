export const moduleData = {
    "name":"example",
    "version":"1.0",
    "author":"Group 15 Team",
    "isModuleSource":false,
    "loadOnPages":["basic"]
};

export class Module {
    constructor(Handler) {
        this.handler = Handler;
    }

    onPageLoad(){
        document.getElementById("demo").innerHTML = "Module Loaded!";
    }
}
