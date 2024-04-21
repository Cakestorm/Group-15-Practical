export const moduleData = {
    "name":"basic_text_editor",
    "version":"1.0",
    "author":"Jacob Roe",
    "isModuleSource":false,
    "loadOnPages":["editor"] 
};

export class Module {
    constructor(Handler) {
        this.handler = Handler;
    }
    
    onPageLoad() {
        // Change Page Title As Appropriate
        let url = window.location.href.split('/');
        let name = url[4];
        document.querySelector("title").textContent = name;

        this.loadNote();
        let self = this;
        document.querySelector("#save_button").onclick = function() {self.saveNote()};
    }

    async loadNote()
    {
        let url = window.location.href.split('/');
        let name = url[4];

        let data = await this.handler.getNote(name, "default_server_note_source");
        let div = document.getElementById('editor');
        let quill = Quill.find(div);
        let text = await data["body"];
        quill.setContents(text);
    }

    saveNote()
    {
        let url = window.location.href.split('/');
        let name = url[4];

        let div = document.getElementById('editor');
        let quill = Quill.find(div);
        console.log(quill.getContents());
        this.handler.patchNote("default_server_note_source", name, JSON.stringify({"body":quill.getContents()}))
    }
}
