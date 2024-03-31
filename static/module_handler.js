class Module {
    constructor(Handler) {
        this.handler = Handler;
        this.isModuleSource = true;
        this.source_name = "serverModules";
        document.getElementById("demo").innerHTML = "server modules module loaded";
        this.asyncCon();
    }
    
    async asyncCon() {
        // Get list of modules made available by this and load all of them
        // todo: redundancy checks 
        var toLoad = await this.getModules(); // Todo: Check whether modules are enabled or not before loading them
        //document.getElementById("demo").innerHTML = await toLoad;
        for (let x in await toLoad) {
            //document.getElementById("demo").innerHTML = toLoad[x];
            var mod = await this.getModule(toLoad[x]);
            //document.getElementById("demo").innerHTML = await mod;
            this.handler.loadModuleString(mod)
        }
    }
    
    async getModules() {
        let address = "/module_list";
        const response = await fetch(window.location.protocol + "//" + window.location.host + address);
        let data = await response.text();
        return data.split(";");
    }
    
    async getModule(name) {
        let address = "/modules/" + name;
        const response = await fetch("/static" + address);
        let data = await response.text();
        return data;
    }
}

class ModuleHandler {
    constructor() {
        this.loadedModules = [];
    }

    loadModule(source, name) {
        var returned = source.getModule(name);
    }

    async loadModuleString(string) {
        //console.log(string)
        let modfile = await import("data:text/javascript," + string);
        //console.log(await modfile.Module)
        this.loadModuleData(await modfile.Module)
    }

    loadModuleData(mod) {
        let modulet = new mod(this);
        this.loadedModules.push(modulet);
    }
}

let mhand = new ModuleHandler();
mhand.loadModuleData(Module);

//document.getElementById("demo").innerHTML = window.location.host;
