(async () => {
let $ = Almagest;
// BEGIN MODULE

const counter = document.createElement("span");
counter.style.float = "right";
counter.style.marginTop = "0.25rem";
counter.style.marginRight = "1rem";
counter.style.color = "var(--alma-grey)";

function updateCounter() {
	const text = $.editor.quill.getText();
	const words = text.split(/\s+/).filter(str => /\w+/.test(str));
	if (words.length === 1) {
		counter.innerText = "1 word";
	} else {
		counter.innerText = `${words.length} words`;
	}
}

document.querySelector("body > main .ql-toolbar").append(counter);

$.editor.quill.on("text-change", updateCounter);
addEventListener("almagest:note-loaded", updateCounter);
updateCounter();

// END MODULE
})();
