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
