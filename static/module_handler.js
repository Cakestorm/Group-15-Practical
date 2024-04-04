moduleData = {
    "name":"default_module_source", // Unique Identifier
    "version":"1.0", // Used in case module sources have multiple copies (todo)
    "author":"Group 15 Team", // No direct influence currently, but likely good to have
    "isModuleSource":true,
    "isNoteSource":false,
    "sourcePriority":1000, // Used to resolve cases where multiple sources have a file (likely make this customisable by the user?
    "loadOnPages":[] // Empty or undefined means "all pages"
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
            this.handler.loadModuleData(await mod.Module, await mod.moduleData);
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
        this.loadedPage = ""; // Updated whenever loadPage is called
        this.processingModules = false; // Safety flag. function relating to processing modules does not operate if this is set, sets it while operating.
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

    loadModuleData(mod, data) {
        console.log(data["name"]);
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

    modifyNote(destination, name, data) {
        return this.loadedModules[destination]["module"].modifyNote(name, data);
    }
    
    deleteNote(destination, name) {
        return this.loadedModules[destination]["module"].deleteNote(name);
    }
    
    // Load a page with a given name, informing all loaded modules about doing so.
    loadPage(name) {
        this.loadedPage = name;
        for (let x in this.loadedModules) {
            if (
                (!this.loadedModules[x]["data"]["loadOnPages"]) // property is not true
                || this.loadedModules[x]["data"]["loadOnPages"].includes(name) // name is one of the pages this module watches for
            ) {
                this.loadedModules[x]["module"].onPageLoad();
            }
        }
    }
}

// Returns true iff a is higher version number than b
function isGreaterVersion(a,b) {
    let alist = a.split(".");
    let blist = b.split(".");
    while (true) {
        if (alist.length == 0) {
            return false
        } else if (blist.length == 0) {
            return true
        }
        if (alist[0] > blist[0]) {
            return true
        }
        alist = alist.slice(1);
        blist = blist.slice(1);
    }
}

let mhand = new ModuleHandler();
mhand.loadModuleData(Module, moduleData);


//document.getElementById("demo").innerHTML = window.location.host;
