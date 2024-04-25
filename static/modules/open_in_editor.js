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
        let self = this;
        document.querySelector("#open").onclick = function() {self.open_editor()};
    }

    open_editor(){
        let url = window.location.href;
        let name = document.getElementById("name").value;
        window.open(url+'edit_note/'+name);
    }
}