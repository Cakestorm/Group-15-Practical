export const moduleData = {
    "name":"default_server_note_source", // Unique Identifier
    "version":"1.0", // Used in case module sources have multiple copies (todo)
    "author":"Group 15 Team", // No direct influence currently, but likely good to have
    "isModuleSource":false,
    "isNoteSource":true,
    "sourcePriority":100 // Used to resolve cases where multiple sources have a file
}

export class Module {
    constructor(Handler) {
        this.handler = Handler
    }
    
    async getNoteList() { // obtains list of notes available from this source
        let address = "/note_list";
        const response = await fetch(address);
        let data = await response.text();
        return data.split(";")
    }
    
    async postNote(data) { // send data to store as new note
        let name = crypto.randomUUID(); // This is not perfect: if not local, this *must* be done over HTTPS, though that seems likely enough regardless. Probably want backup though?
        return await this.patchNote(name, data), name;
    }
    
    async getNote(name) { // retrieve given note
        let address = "/get_note/" + name;
        const response = await fetch(address);
        let data = await response.json();
        //console.log(data);  
        return await data
    }
    
    async patchNote(name, data) { // store data for given note
        let address = "/post_note/" + name;
        const response = fetch(address, {
          method: "POST",
          body: data,
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
        });
    }
    
    async deleteNote(name) { // deletes note with given name
    } 
}
