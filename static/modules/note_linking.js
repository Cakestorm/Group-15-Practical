export const moduleData = {
    "name":"note_linking",
    "version":"1.0",
    "author":"Owen Guo",
    "isModuleSource":false,
    "loadOnPages":["basic"]
}

export class Module {
    constructor(Handler) {
        this.handler = Handler;
    }

    onPageLoad(){
        var self = this
        //console.log(this);
        //console.log(this.handler);
        document.getElementById("link").onclick = function() {self.saveLinking()};
    }
    
    async saveLinking() { //async or not?
        //Currently, this simply extracts the names (better to use note ID) of all the available notes to be linked.
        //TODO: pass this to more specific functions that automatically finds relevant links, based on keywords or semantic similarity etc.
        //TODO: user should be able to customise the linked notes as well?
        
        let pth_list = await this.handler.getNoteList();
        // TODO: pth_list = get_linked_notes(current_name, list_of_notes)

        //Modify the attributes of a saved note
        let name = document.getElementById("name").value;
        this.handler.modifyNote("default_server_note_source", name, JSON.stringify({"links":pth_list}))

        //Display the names of linked notes on the webpage (TODO: better display paths to those notes)
        //TODO: Displaying the linked notes should also be done when a note is loaded.
        let display_str = ""
        for(let x in pth_list) {
            display_str += ('>> '+ pth_list[x] + '.note\n')
        }
        document.getElementById("linked_notes").value = display_str;
    }
}
