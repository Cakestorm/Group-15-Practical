export const moduleData = {
    "name":"note_display",
    "version":"1.0",
    "author":"Cem Kozanoglu",
    "isModuleSource":false,
    "loadOnPages":["basic"]
};

export class Module {
    constructor(Handler) {
        this.handler = Handler;
    }

    onPageLoad(){
        //console.log(this);
        //console.log(this.handler);
        var self = this
        this.displaynotes()
        document.getElementById("notes").onclick = function() {self.displaynotes()};
    }

    async displaynotes(){

        let data = await this.handler.getNoteList();
        let noteslist = ""
        for (let line of data){
            noteslist = noteslist + "- " + line.split(":")[1] + "\n"
        }
        document.getElementById("note").innerHTML = "The notes available in your local folder: \n" + noteslist;
    }
    
    

}
