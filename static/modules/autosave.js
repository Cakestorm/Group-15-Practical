(async () => {
const $ = Almagest;
// BEGIN MODULE

$.config.autoSave = {
    interval: 600,
    ...$.config.autoSave,
};

let saving = false, resave = false, timer;
$.editor.quill.on("text-change", () => {
    if (saving) {
        // Saving in progress. Ask for resave once it is done.
        resave = true;
        return;
    }

    clearTimeout(timer);
    timer = setTimeout(async function doSave() {
        saving = true;
        const noteUrl = location.toString();
        const title = (
            $.editor.querySelector("h1")?.innerText ||
            $.editor.querySelector("h2")?.innerText ||
            $.editor.querySelector("h3")?.innerText ||
            $.editor.quill.getText(0, 47).replace(/\s+/g, " ") + "..."
        );
        await $.api.note.update($.editor.dataset.noteid, {
            title,
            body: $.editor.quill.getContents(),
            text: $.editor.innerText,
            updatedAt: new Date().getTime(),
        });
        saving = false;

        Array.from(document.querySelectorAll("body > aside li a"))
            .filter(item => item.href === noteUrl)
            .forEach(item => item.innerText = title);

        if (resave) {
            resave = false;
            timer = setTimeout(doSave, $.config.autoSave.interval);
        }
    }, $.config.autoSave.interval);
});

// END MODULE
})();
