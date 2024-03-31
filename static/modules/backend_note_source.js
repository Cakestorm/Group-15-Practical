moduleData = {
    "name":"default_server_note_source", // Unique Identifier
    "version":"1.0", // Used in case module sources have multiple copies (todo)
    "author":"Group 15 Team", // No direct influence currently, but likely good to have
    "isModuleSource":false,
    "isNoteSource":true,
    "sourcePriority":100 // Used to resolve cases where multiple sources have a file
}

export class Module {
    constructor(Handler) {
        
    }
    
    async getNoteList() { // obtains list of notes available from this source
        let address = "/note_list";
        const response = await fetch(address);
        let data = await response.text();
        return data.split(";");
    }
    
    async postNote(name, data) { // send data to store as new note
    }
    
    async getNote(name) { // retrieve given note
    }
    
    async patchNote(name, data) { // unsure how this differs from post
        return await postNote(name, data); // Potentially a placeholder, though I'm not certain what the difference would actually be
    }
    
    async deleteNote(name) { // deletes note with given name
    } 
}
