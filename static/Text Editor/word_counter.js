class WordCounter{
    constructor(quill, options){
        this.quill = quill;
        this.options = options;
        this.container = document.querySelector(options.container);

        quill.on(Quill.events.TEXT_CHANGE, () => this.update());
    }

    update(){
        let text = this.quill.getText().split(/[\s|\n]+/).filter(str => /\w+/.test(str));
        let count = text.length;
        this.container.textContent = count + ' words';
    }
}

Quill.register('modules/wordCounter', WordCounter);