export const moduleData = {
    "name":"note_linking",
    "version":"1.0",
    "author":"Owen Guo",
    "isModuleSource":false
}

export class Module {
    constructor(Handler) {
        this.handler = Handler;
        var self = this
        document.getElementById("link").onclick = function() {self.saveLinking()};
    }
    
    async saveLinking() { //async or not?
        //Currently, this simply extracts the names (better to use note ID) of all the available notes to be linked.
        //TODO: pass this to more specific functions that automatically finds relevant links, based on keywords or semantic similarity etc.
        //TODO: user should be able to customise the linked notes as well?
        let address = "/note_list";
        const response = await fetch(address);
        let data = await response.text();
        data = data.split(";");

        //Modify the attributes of a saved note
        let name = document.getElementById("name").value;
        this.handler.modifyNote("default_server_note_source", name, JSON.stringify({"links":data}))

        //Display the names of linked notes on the webpage (TODO: better display paths to those notes)
        //TODO: Displaying the linked notes should also be done when a note is loaded.
        let display_str = ""
        for(let x in data) {
            display_str += (data[x] + '.note\n')
        }
        document.getElementById("linked_notes").value = display_str;
    }
}
