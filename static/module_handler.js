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
        this.processingModules = 0; // Safety flag. function relating to processing modules does not operate if this is set, sets it while operating. TODO: make this actually do something
        this.uninitialisedModules = false; // Flag for whether new modules have been loaded but not yet initiliased
        this.config = { // TODO: general functionality for this
            "disabledModules":[],
            "moduleConfig":{}
        };
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
        // Todo: Check whether modules are enabled or not before loading them
        //console.log(data["name"]);
        let modulet = new mod(this);
        
        if (data["name"] in this.loadedModules) {
            if (!isGreaterVersion(data["version"], this.loadedModules[data["name"]]["data"]["version"])) {
                return false // don't bother loading a module if it's not a higher version
            }
        }
        
        this.loadedModules[data["name"]] = {
            "module": modulet,
            "data": data,
            "loadedStatus": false
        };
        if (data["isModuleSource"]) {
            this.moduleSources.push(data["name"]);
            this.loadModulesFrom(data["name"]);
        };
        if (data["isNoteSource"]) {
            this.noteSources.push(data["name"]);
        }
        this.uninitialisedModules = true;
        return true; // Successfully loaded module
    }
    
    // Load (do not initlialise) all modules from specified source.
    async loadModulesFrom(modname) {
        this.processingModules += 1;
        let mod = this.loadedModules[modname]["module"]
        // Get list of modules made available by this and load all of them
        var toLoad = await mod.getModules();
        for (let x in await toLoad) {
            var thismod = await mod.getModule(toLoad[x]);
            this.loadModuleData(await thismod.Module, await thismod.moduleData);
        }
        this.processingModules -= 1;
        this.initialiseModules() // Despite name, this'll fail if other modules are still prepping stuff, or nothing new has been loaded
    }
    
    initialiseModules() {
        if (this.processingModules > 0 || !this.uninitialisedModules) {
            return false; // Not in safe state to load
        }
        
        let modulesToLoad = []
        for (let x in this.loadedModules) {
            if (!this.loadedModules[x]["loadedStatus"]) {
                modulesToLoad.push(x);
            }
        }

        self = this;
        // sort modules by priority
        modulesToLoad.sort(function(a,b) {
            return self.getModulePriority(a) - self.getModulePriority(b)
        });
        
        modulesToLoad.forEach((x) => {
            if (this.loadedModules[x]["module"].initialise)
                this.loadedModules[x]["module"].initialise();
            this.loadPageFor(this.loadedPage, x);
            this.loadedModules[x]["loadedStatus"] = true;
        })
    }
    
    getModulePriority(name) {
        return this.loadedModules[name]["data"]["priority"] //TODO: implement functionality for changing module priority
    }
    
    async getNoteList() { // Get list of notes from all loaded Note Sources
        let toret = [];
        for (let x of this.noteSources) {
            var notes = await this.loadedModules[x]["module"].getNoteList();
            for (let y of notes) {
                toret.push(x + ":" + y);
            }
        }
        return toret
    }
    
    postNote(destination, data) {
        return this.loadedModules[destination]["module"].postNote(data);
    }
    
    getNote(name, source) {
        let trueSource = source;
        if (source == undefined) {
            let sources = this.getNoteSources(name);
            if (sources.length == 0) {
                // TODO: throw error if no source has the given note
            } else {
                trueSource = source[0];
            }
        }
        // TODO: throw error if source doesn't have file
        return this.loadedModules[trueSource]["module"].getNote(name);
    }
    
    getNoteSources(name) { // return list of source that contain the given name, sorted by priority.
        let toret = [];
        for (let x of this.noteSources) {
            if (this.loadedModules[x]["module"].hasNote(name)) {
                toret.push(x);
            }
        }
        
        // Sort by priority
        self = this;
        toret.sort(function(a,b) {
            return self.getModulePriority(a) - self.getModulePriority(b)
        });
        
        return toret
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

    displaynotes() {
        return this.loadedModules['note_display']["module"].displaynotes();
    }
    
    // Load a page with a given name, informing all loaded modules about doing so.
    loadPage(name) {
        this.loadedPage = name;
        for (let x in this.loadedModules) {
            this.loadPageFor(name, x);
        }
    }
    
    loadPageFor(name, module) {
        let mod = this.loadedModules[module]["data"]["loadOnPages"]
        if (
            (!mod) || mod.length==0 // property is not true or is empty
            || mod.includes(name)   // name is one of the pages this module watches for
        ) {
            //console.log(this.loadedModules[module]["data"]["name"]);
            if(this.loadedModules[module]["module"].onPageLoad)
                this.loadedModules[module]["module"].onPageLoad();
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

window.onload = function() {
    let pageName = document.querySelector("#page_name");
    if(pageName) mhand.loadPage(pageName.getAttribute("page_name"));
}

let mhand = new ModuleHandler();
mhand.loadModuleData(Module, moduleData);

//document.getElementById("demo").innerHTML = window.location.host;
