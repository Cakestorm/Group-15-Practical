(async () => {
const $ = Almagest;
// BEGIN MODULE

function debounce(fn) {
    let timer;

    return (() => {
        clearTimeout(timer);
        timer = setTimeout(fn, 200);
    });
}

function populateNoteList(container, list) {
    container.childNodes.forEach((oldItem) => oldItem.remove());
    for (let note of list) {
        const link = document.createElement("a");
        link.href = `#${note.id}`;
        link.innerText = note.name || note.title;
        const li = document.createElement("li");
        li.append(link);
        container.append(li);
    }
}

const searchBox = document.querySelector("#search");
async function updateSearch() {
    const searchPrompt = searchBox.value;
    let searchResults;
    if (searchPrompt.trim()) {
        searchResults = await $.api.search(searchPrompt);
    } else {
        searchResults = await $.api.note.list();
        searchResults.sort((a, b) => a.name.localeCompare(b.name));
    }

    const container = document.querySelector("#side-search ol");
    populateNoteList(container, searchResults);
}

updateSearch();
searchBox.addEventListener("input", debounce(updateSearch));

async function updateRelatedNotes() {
    const related = await $.api.related($.editor.dataset.noteid);
    const container = document.querySelector("#side-related ol");
    populateNoteList(container, related);
}

updateRelatedNotes()
addEventListener("almagest:note-loaded", updateRelatedNotes);

// END MODULE
})();