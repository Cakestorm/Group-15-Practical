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
		await $.api.note.update($.editor.dataset.noteid, {
			contents: $.editor.quill.getContents(),
		});
		saving = false;

		if (resave) {
			resave = false;
			timer = setTimeout(doSave, $.config.autoSave.interval);
		}
	}, $.config.autoSave.interval);
});

// END MODULE
})();