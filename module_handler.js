class module {
    constructor(Handler) {
        this.handler = Handler;
        this.is_module_source = true;
        this.source_name = "server_modules";
        document.getElementById("demo").innerHTML = "server modules module loaded";
        this.async_con();
    }
    
    async async_con() {
        // Get list of modules made available by this and load all of them
        // todo: redundancy checks 
        var to_load = await this.get_modules(); // Todo: Check whether modules are enabled or not before loading them
        //document.getElementById("demo").innerHTML = await to_load;
        for (let x in await to_load) {
            //document.getElementById("demo").innerHTML = to_load[x];
            var mod = await this.get_module(to_load[x]);
            //document.getElementById("demo").innerHTML = await mod;
            this.handler.load_module_string(mod)
        }
    }
    
    async get_modules() {
        let address = "/module_list";
        const response = await fetch(window.location.protocol + "//" + window.location.host + address);
        let data = await response.text();
        return data.split(";");
    }
    
    async get_module(name) {
        let address = "/modules/" + name;
        const response = await fetch(window.location.protocol + "//" + window.location.host + address);
        let data = await response.text();
        return data;
    }
}

class module_handler {
    constructor() {
        this.loaded_modules = [];
    }

    load_module(source, name) {
        var returned = source.get_module(name);
    }

    async load_module_string(string) {
        //console.log(string)
        let modfile = await import("data:text/javascript," + string);
        //console.log(await modfile.module)
        this.load_module_data(await modfile.module)
    }

    load_module_data(mod) {
        let modulet = new mod(this);
        this.loaded_modules.push(modulet);
    }
}

let mhand = new module_handler();
mhand.load_module_data(module);

//document.getElementById("demo").innerHTML = window.location.host;
