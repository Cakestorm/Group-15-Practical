(async () => {
let $ = Almagest;
// BEGIN MODULE

const quill = $.editor.quill;

const formulaHandler = function (value){
    const range = quill.getSelection(true);
    const text = quill.getText(range.index, range.length);

    quill.deleteText(range.index, range.length, Quill.sources.USER);
    quill.insertEmbed(range.index, 'latexblock', text, Quill.sources.USER);
    //quill.insertEmbed(range.index + 1 + range.length, 'latexblock', true, Quill.sources.USER);
    quill.insertText(range.index + 1, ' ');
    quill.setSelection(range.index+2);
}

const toolbar = quill.getModule('toolbar');
toolbar.addHandler('formula', formulaHandler);

// END MODULE
})();
    