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
    }
    
    async displaynotes(){

        let data = await this.handler.getNoteList();
        let noteslist = ""
        for (let line of data){
            let url = window.location.href
            let text = line.split(":")[1]
            noteslist = noteslist + '<input type="radio" id="'+text+'" name="choice" value="'+text+'" onclick="handleClick(this);"/><label for="'+text+'">'+text+'</label><br>'
        }
        document.getElementById("note").innerHTML = noteslist;        
    }
}
    


