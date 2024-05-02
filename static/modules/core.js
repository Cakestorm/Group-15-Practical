(async () => {
const $ = Almagest;
// BEGIN MODULE

// Initialize Quill editor
$.editor = document.querySelector("body > main article");
$.editor.quill = new Quill($.editor, {
    theme: "snow",
    modules: {
        toolbar: [
            [{ header: [] }],
            ["bold", "italic", "underline", "strike", "code"],
            [{ color: [] }, { background: [] }, { align: [] }],
            [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
            ["blockquote", "code-block"],
            ["link", "image", "video"],
            [{ script: "sub" }, { script: "super" }, "formula"],
            ["clean"],
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
const searchCount = Math.floor(
    sideSearch.querySelector("ol").clientHeight /
    sideSearch.querySelector("li").clientHeight
);

// Measure the size of the related result container (ol) and a related result
// item (li), to calculate the number of items that can fit into the container
const relatedCount = Math.floor(
    sideRelated.querySelector("ol").clientHeight /
    sideRelated.querySelector("li").clientHeight
);

// Initialze the search panel in the side bar
// No search query, just display some entries of the entire note list
const searchLoadedPromise = (async () => {
    const searchResult = sideSearch.querySelector("ol");
    searchResult.querySelector("li").remove();

    (await $.api.note.list()).slice(0, searchCount).forEach((note) => {
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
