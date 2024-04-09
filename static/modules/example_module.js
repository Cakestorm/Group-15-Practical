export const moduleData = {
    "name":"example",
    "version":"1.0",
    "author":"Group 15 Team",
    "isModuleSource":false,
    "loadOnPages":["basic"],
    "config": {
        "message": {
            "default": "Module Loaded!",
            "type": "string"
        }
    }
};

export class Module {
    constructor(Handler) {
        this.handler = Handler;
    }

    onPageLoad(){
        document.getElementById("demo").innerHTML = this.handler.config.getConfig("module/example/message");
    }
}
