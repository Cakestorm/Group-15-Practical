export const moduleData = {
    "name":"open_in_editor",
    "version":"1.0",
    "author":"Jacob Roe",
    "isModuleSource":false,
    "loadOnPages":["basic"]
};

export class Module {
    constructor(Handler) {
        this.handler = Handler;
    }

    onPageLoad(){
        console.log("editor loaded")
        var self = this;
        
        document.getElementById("open").onclick = function() {self.open_editor()};
        
    }

    open_editor(){
        let url = window.location.href;
        let name = document.querySelector('input[name="choice"]:checked').value;
        window.open(url+'edit_note/'+name);
    }
}