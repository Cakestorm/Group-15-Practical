(async () => {
    const $ = Almagest;
    // BEGIN MODULE
    
    // Search through note names using array of search prompts and output into container (TEMP)
    async function search (searchPrompts, container){
    // Measure the size of the search result container (ol) and a search result
    // item (li), to calculate the number of items that can fit into the container

    console.log(searchPrompts);

    let filtered = [];
    for (let prompt of searchPrompts) {
        if (prompt != "" && prompt != "\n") {
            filtered.push(prompt)
        }
    }
    searchPrompts = filtered;
    if (searchPrompts.length == 0) return;

    const searchResults = [];
    const noteslist = (await $.api.note.list());
    for (let note of noteslist){
        console.log(note)
        for (let prompt of searchPrompts) {
            if (note.name.toLowerCase().includes(prompt.toLowerCase()) &&
                !searchResults.includes(note)) {
                searchResults.push(note)
            }
        }
    }

    searchResults.sort((a, b) => a.name.localeCompare(b.name));

    (async () => {
        const searchResult = container.querySelector("ol");
        (searchResult.querySelectorAll("li")).forEach((element) => {element.remove()})

        for (let note of searchResults){
            const link = document.createElement("a");
            link.href = `#${note.id}`;
            link.innerText = note.name || note.title;
            const li = document.createElement("li");
            li.append(link);
            searchResult.append(li);

        }
    })();
    }

    async function updateSearch (){
        // Initialize the sidebar
        const sidebar = document.querySelector("body > aside");
        const [sideSearch, sideRelated] = sidebar.querySelectorAll("section");

        // Side search
        let searchPrompts = document.querySelector("#search").value.split(" ");
        search(searchPrompts, sideSearch);

        // Related search
        let text = $.editor.quill.container.innerText;
        searchPrompts = text.split("\n").flatMap((s) => s.split(" "));
        search(searchPrompts, sideRelated);
    }

    function debounce(fn) {
        let timer;

        return () => {
            clearTimeout(timer);
            timer = setTimeout(fn, 200);
        }
    }
    
    document.querySelector("#search").addEventListener("input", debounce(updateSearch));

    // Do not wait for search to load; keep on initializing
    addEventListener("almagest:note-loaded", updateSearch);

    // END MODULE
    })();
    