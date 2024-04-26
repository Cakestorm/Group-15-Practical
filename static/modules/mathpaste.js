(async () => {
const $ = Almagest;
// BEGIN MODULE

function makeFormula(latex) {
	const Delta = Quill.import("delta");
	return new Delta().insert({ formula: latex });
}

// Quill formula
//
// <span class="ql-formula" data-value="[LATEX]">[...]</span>
$.editor.quill.clipboard.addMatcher(".ql-formula[data-value]", (el) => {
	let latex = el.dataset.value;
	if (latex) return makeFormula(latex);
});

// In addition, when copying a Quill formula, Quill calls the html() method
// of the "formats/formula" class to create a alternative HTML representation
// suitable for copying.
//
// Unfortunately, "formats/formula" defines this method as
//
// html() {
//     const { formula } = this.value();
//     return `<span>${formula}</span>`;
// }
//
// and thus copies <span>[LATEX]</span> onto the clipboard.

// This representation is entirely useless for us. When handling pasting, we do
// not know where the user have copied the HTML from. The <span>[...]</span>
// could totally been from some other website and its content is probably just
// some text, not LaTeX code.
//
// Therefore we override this method, to instead return
// <span class="almagest-latex">[LATEX]</span>
// Since "almagest-latex" is a pretty "unique" name, whenever we see this
// during a paste, we know that its content will be LaTeX code. For other
// applications that do not know or care about Almagest, they will ignore the
// class and the behavior is the same as before: pasting the LaTeX code.
Quill.import("formats/formula").prototype.html = function() {
	const { formula } = this.value();
	return `<span class="almagest-latex">${formula}</span>`;
}

$.editor.quill.clipboard.addMatcher(".almagest-latex", (el) => {
	const latex = el.innerText;
	if (latex) return makeFormula(latex);
});

// Mediawiki math formula (Wikipedia, etc.)
//
// <div class="mwe-math-element">
//   <div class="mwe-math-mathml-(display|inline) [...]" [...]>
//     <math [...] alttext="[LATEX]">
//       <semantics>
//         [...]
//         <annotation encoding="application/x-tex">
//           [LATEX]
//         </annotation>
//       </semantics>
//     </math>
//   </div>
//   <img class="mwe-math-fallback-image-(display|inline) [...]" [...]
//        alt="[LATEX]">
// </div>
$.editor.quill.clipboard.addMatcher(".mwe-math-element", (el) => {
	let latex = el.querySelector("math annotation[encoding='application/x-tex']").innerText;
	latex ||= el.querySelector("math[alttext]").getAttribute("alttext");
	latex ||= el.querySelector("img.mwe-math-fallback-image-display[alt]").alt;
	latex ||= el.querySelector("img.mwe-math-fallback-image-inline[alt]").alt;
	if (latex) return makeFormula(latex);
});

// KaTeX formula
//
// <span class="katex">
//   <span class="katex-mathml">
//     <math xmlns="http://www.w3.org/1998/Math/MathML">
//       <semantics>
//         [...]
//         <annotation encoding="application/x-tex">
//           [LATEX]
//         </annotation>
//       </semantics>
//     </math>
//   </span>
//   <span class="katex-html" [...]>[...]</span>
// </span>

// TODO

// MathJax formula
// TODO

// END MODULE
})();
