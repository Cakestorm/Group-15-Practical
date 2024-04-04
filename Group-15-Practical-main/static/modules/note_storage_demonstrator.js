export const moduleData = {
    "name":"demonstrate_note_sorage",
    "version":"1.0",
    "author":"Jonathan Kuck",
    "isModuleSource":false
};

export class Module {
    constructor(Handler) {
        this.handler = Handler;
        //console.log(this);
        //console.log(this.handler);
        var self = this
        document.getElementById("load").onclick = function() {self.loadWigit()};
        document.getElementById("save").onclick = function() {self.saveWigit()};
    }
    
    async loadWigit() {
        let name = document.getElementById("name").value;
        let data = await this.handler.getNote(name, "default_server_note_source");
        //console.log(data);
        document.getElementById("data").value = await data["body"];
    }
    
    saveWigit() {
        //console.log(this);
        //console.log(this.handler);
        let name = document.getElementById("name").value;
        this.handler.patchNote("default_server_note_source", name, JSON.stringify({"body":document.getElementById("data").value}))
    }
}
