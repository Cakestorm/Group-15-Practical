moduleData = {
    "name":"default_module_source", // Unique Identifier
    "version":"1.0", // Used in case module sources have multiple copies (todo)
    "author":"Group 15 Team", // No direct influence currently, but likely good to have
    "isModuleSource":true,
    "isNoteSource":false,
    "sourcePriority":0, // Used to resolve cases where multiple sources have a file (likely make this customisable by the user?
    "urlForm":"**"
}

class Module {
    constructor(Handler) {
        this.handler = Handler;
        //document.getElementById("demo").innerHTML = "server modules module loading...";
        this.asyncCon(); // todo: Doing anything in the constructor like this is bad in case of version conflicts - add proper infrastructure for this later
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
            this.handler.loadModuleData(await mod.Module, await mod.moduleData)
        }
    }
    
    async getModules() {
        let address = "/module_list";
        const response = await fetch(address);
        let data = await response.text();
        return data.split(";");
    }
    
    async getModule(name) {
        let address = "/modules/" + name;
        return await import("/static" + address);
    }
}

class ModuleHandler {
    constructor() {
        this.loadedModules = {};
        this.moduleSources = [];
        this.noteSources = [];
    }

    loadModule(source, name) {
        var returned = source.getModule(name);
    }

    async loadModuleString(string) { // Depreceated: trying to do it in this way makes comments in modules break stuff. Interpreting modules should be done by sources
        //console.log(string)
        let modfile = await import("data:text/javascript," + string);
        //console.log(await modfile.Module)
        this.loadModuleData(await modfile.Module, await modfile.moduleData)
    }

    isValidURLForm(string){
        let form = string.split('/');
        let url = window.location.href.split('/');
        url.splice(0,2);  // Removes 'https' and '' from the list
        url.pop(); // Removes '' from the end of a list
        while(form.length > 0 || url.length > 0){
            if (form.length <= 0) return false;
            if (form[0] == '**') return true;
            let fNext = form.shift();
            let uNext = url.shift();
            if(fNext != uNext && fNext != '*') return false;
        }
        return true
    }

    loadModuleData(mod, data) {
        console.log(data["name"]);
        if(this.isValidURLForm(data["urlForm"])){
            //console.log(data["name"]);
            let modulet = new mod(this);
            //this.loadedModules.push(modulet);
            //todo: version check
            this.loadedModules[data["name"]] = {
                "module": modulet,
                "data": data
            };
            if (data["isModuleSource"]) {
                this.moduleSources.push(data["name"]);
            };
            if (data["isNoteSource"]) {
                this.noteSources.push(data["name"]);
            }
        }
    }
    
    getNoteList() { // Get list of notes from all loaded Note Sources
        let toret = [];
        for (let x in this.noteSources) {
            var notes = this.loadedModules[x]["module"].getNoteList();
            for (let y in notes) {
                toret.push(x + ":" + y);
            }
        }
        return toret
    }
    
    postNote(destination, data) {
        return this.loadedModules[destination]["module"].postNote(data);
    }
    
    getNote(name, source) {
        if (source == undefined) {
            //todo: find source that has file, throw error if none has
        }
        // todo: throw error if source doesn't have file
        return this.loadedModules[source]["module"].getNote(name);
    }
    
    patchNote(destination, name, data) {
        return this.loadedModules[destination]["module"].patchNote(name, data);
    }
    
    deletehNote(destination, name) {
        return this.loadedModules[destination]["module"].deleteNote(name);
    }
}

let mhand = new ModuleHandler();
mhand.loadModuleData(Module, moduleData);

//document.getElementById("demo").innerHTML = window.location.host;
