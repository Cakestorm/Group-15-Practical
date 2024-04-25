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
    
    async saveLinking() {
        // Obtain current note name
        let name = document.getElementById("name").value;

        //Pass to backend using /get_links to extract the top n most relevant links, given the current note
        //TODO: user should be able to customise the linked notes as well?
        var pth_list = await this.handler.getNoteList();
        $.ajax({
            'async': false,
            'type': "GET",
            'url': "/get_links",
            'data': {}
        }).done(function(top_matches) {
            pth_list = top_matches  //Replace whatever nonsense with the linked notes
        });
        //console.log(pth_list)

        //Modify the attributes of a saved note
        this.handler.modifyNote("default_server_note_source", name, JSON.stringify({"links":pth_list}))

        //Display the names of linked notes on the webpage (TODO: better display paths to those notes)
        //TODO: Displaying the linked notes should also be done when a note is loaded.
        let display_str = ""
        for(let x in pth_list) {
            display_str += ('>> '+ pth_list[x] + '\n')
        }
        document.getElementById("linked_notes").value = display_str;
    }
}
