(async () => {
const $ = Almagest;
// BEGIN MODULE
// Initialize Quill editor
$.editor = document.querySelector("body > main article");
$.editor.quill = new Quill($.editor, {
    theme: "snow",
    modules: {
        toolbar: [ //HB: I removed stuff that'd be really inconvenient to style, that's not really necessary anyways.
            [{ header: [] }],
            ["bold", "italic", "underline"],
            [{ color: ['#332966', '#47a1b3', '#98add9', '#edfaff', '#52cca3', '#50c75a', '#edfaff'] }, { align: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link"],
            ["formula"]
        ],
    },
});

// Load the note
const noteLoadedPromise = (async () => {
    // The idea: /#note-id is the URL
    // All links to notes will have href="#note-id"
    // When the user clicks such a link, the #... part of the URL changes,
    // and the browser will dispatch a hashchange event, which we handle by
    // loading the new note (through loadNote()).
    async function loadNote() {
        const noteid = location.hash.slice(1);
        const note = await $.api.note.get(noteid);
        $.editor.dataset.noteid = noteid;
        $.editor.quill.setContents(note?.body || {}, "silent");
        $.editor.quill.history.clear();
        document.title = note.title ? `${note.title} - Almagest` : "Almagest";
        dispatchEvent(new CustomEvent("almagest:note-loaded", { detail: note }));
    }

    // TODO: find the default note, instead of hard coding "index"
    location.hash = location.hash || "#index";
    addEventListener("hashchange", loadNote);
    await loadNote();
})();
// Do not wait for the note to load; keep on initializing

// Initialize the sidebar
const sidebar = document.querySelector("body > aside");
const [sideSearch, sideRelated] = sidebar.querySelectorAll("section");

// Measure the size of the search result container (ol) and a search result
// item (li), to calculate the number of items that can fit into the container

/** HB - due to changes in the way the website is styled, we can
  * load arbitrarily many notes. I just opted to set this as a big constant (9999)
  * wherever it was previously used. 
const searchCount = Math.floor(
    sideSearch.querySelector("ol").clientHeight /
    sideSearch.querySelector("li").clientHeight
);
*/
const searchCount = 9999;

// Measure the size of the related result container (ol) and a related result
// item (li), to calculate the number of items that can fit into the container

/** HB - As above. 
const relatedCount = Math.floor(
    sideRelated.querySelector("ol").clientHeight /
    sideRelated.querySelector("li").clientHeight
); */
const relatedCount = 9999;

// Initialze the search panel in the side bar
// No search query, just display some entries of the entire note list

const searchLoadedPromise = (async () => {
    const searchResult = sideSearch.querySelector("ol");
    searchResult.querySelector("li").remove();

    (await $.api.note.list()).slice(0, searchCount).sort((a, b) => a.name.localeCompare(b.name)).forEach((note) => {
        const link = document.createElement("a");
        link.href = `#${note.id}`;
        link.innerText = note.name || note.title;
        const li = document.createElement("li");
        li.append(link);
        searchResult.append(li);
    })
})();
// Do not wait for search to load; keep on initializing

// New note button
document.querySelector("#new-note").addEventListener("click", async () => {
    const { id } = await $.api.note.create({});
    location.hash = `#${id}`;
});

// TODO: Initialize the "Related notes" panel
console.log(relatedCount);

// Now wait for everything to finish loading
// (completely initialize before loading other modules)
await Promise.all([
    noteLoadedPromise,
    searchLoadedPromise
]);

// Load other modules
// XXX: Consider using $.api.module.get() instead of import()
// Not working for now, since the server endpoint is not implemented yet.
// Can help with portability: save modules elsewhere
Promise.all(
    (await $.api.module.list())
        .filter(mod => mod !== "core.js")
        .map($.api.module.load)
);

// END MODULE
})();
