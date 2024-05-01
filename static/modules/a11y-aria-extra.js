(async () => {
const $ = Almagest;
// BEGIN MODULE

function setAriaLabel(selector, label) {
	const el = document.querySelector(selector);
	if (el) el.setAttribute("aria-label", label);
}

setAriaLabel("span.ql-picker.ql-heading", "heading");
setAriaLabel("span.ql-picker.ql-color",  "text color");
setAriaLabel("span.ql-picker.ql-background", "background color");
setAriaLabel("span.ql-picker.ql-align", "text alignment");

document.querySelectorAll(".ql-formats .ql-picker-label").forEach((el) => {
    el.setAttribute("aria-label", "open picker");
});

document.querySelectorAll(".ql-formats svg").forEach((el) => {
	el.setAttribute("aria-hidden", "true");
});

// END MODULE
})();
