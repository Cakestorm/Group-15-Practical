export const moduleData = {
    "name":"word_counter",
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

        quill.on(Quill.events.TEXT_CHANGE, () => this.update());
    }

    update(){
        let div = document.getElementById('editor');
        let quill = Quill.find(div);
        let container = document.getElementById('counter');

        let text = quill.getText().split(/[\s|\n]+/).filter(str => /\w+/.test(str));
        let count = text.length;
        let oldNum = container.textContent.split(" ")[0]
        container.textContent = count + ' words';
        
        /** Code for styling (HB) */
        
        /** Only do styling if the word count actually changes. */
        if(parseInt(oldNum) != count){            
            /** Reset the animation. */
            container.style.animation = 'none';
            container.offsetHeight; 
            container.style.animation = null; 
        }
    }
}