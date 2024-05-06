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

// New note button
document.querySelector("#new-note").addEventListener("click", async () => {
    const { id } = await $.api.note.create({});
    location.hash = `#${id}`;
});

// Delete note button
document.querySelector("#delete-note").addEventListener("click", async () => {
    if (confirm("Are you sure you want to delete this note?")) {
        const noteid = location.hash.slice(1);
        // Don't allow index to be deleted - instead delete its contents
        // Go back to index after deletion
        if (noteid != 'index') {
            location.hash = '#index';
            await $.api.note.delete(noteid);
        }
        else {
            $.editor.quill.setContents([{ insert: '\n' }]);
        }
    }
});

// Now wait for everything to finish loading
// (completely initialize before loading other modules)
await Promise.all([
    noteLoadedPromise,
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
