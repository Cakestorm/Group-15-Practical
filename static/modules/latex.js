export const moduleData = {
    "name":"latex",
    "version":"1.0",
    "author":"Jacob Roe",
    "isModuleSource":false,
    "loadOnPages":["editor"] 
};

export class Module {
    constructor(Handler) {
        this.handler = Handler;
    }
    
    onPageLoad() {
        let div = document.getElementById('editor');
        let quill = Quill.find(div);
        
        const onClick = (selector, callback) => {
            console.log(selector);
            document.querySelector(selector).addEventListener('click', callback);
        };
        
        onClick('#latex_button', () => {
            const range = quill.getSelection(true);
            const text = quill.getText(range.index, range.length);
            quill.deleteText(range.index, range.length, Quill.sources.USER);
            quill.insertEmbed(range.index, 'latexblock', text, Quill.sources.USER);
            //quill.insertEmbed(range.index + 1 + range.length, 'latexblock', true, Quill.sources.USER);
            quill.insertText(range.index + 1, ' ');
            quill.setSelection(range.index+2);
        });
    }
}