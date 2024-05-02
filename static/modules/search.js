(async () => {
    const $ = Almagest;
    // BEGIN MODULE
    
    async function search (){
               // Initialize the sidebar
    const sidebar = document.querySelector("body > aside");
    const [sideSearch, sideRelated] = sidebar.querySelectorAll("section");

    // Measure the size of the search result container (ol) and a search result
    // item (li), to calculate the number of items that can fit into the container

    const searchPrompt = document.querySelector("#search").value
    console.log(searchPrompt);
    const searchResults = [];
    const noteslist = (await $.api.note.list());
    for (let note of noteslist){
        console.log(note)
        if (note.name.toLowerCase().includes(searchPrompt.toLowerCase())) {
            searchResults.push(note)
        }
    }

    searchResults.sort((a, b) => a.name.localeCompare(b.name));

    (async () => {
        const searchResult = sideSearch.querySelector("ol");
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

    function debounce(fn) {
        let timer;

        return () => {
            clearTimeout(timer);
            timer = setTimeout(fn, 200);
        }
    }
    
    document.querySelector("#search").addEventListener("input", debounce(search));

    // Do not wait for search to load; keep on initializing
    addEventListener("almagest:note-loaded", search);

    // END MODULE
    })();
    