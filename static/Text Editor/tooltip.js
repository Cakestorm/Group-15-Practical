
class Tooltip{
    constructor(element, content, handler){
        this.element = element;
        this.handler = handler;

        this.createObject();
        this.setContent(content);
    }

    // Creates The Object That Will Be Displayed In The Editor
    createObject(){
        this.object = document.createElement('span');
        this.element.append(this.object);

        let self = this;
        this.object.onclick = event => {
            if (event.detail === 2) {
              // it was a double click
              Tooltip.#onObjectClicked(self);
            }
         };
    }

    // Change The Content
    setContent(content){
        if (content=='') content="-LaTeX-"
        this.element.setAttribute('latex', content);
        this.handler(this.object, content);
    }

    // To Be Run When Clicked (Duh)
    static #onObjectClicked(self){
        self.editContent();
    }

    editContent(){
        let content = this.element.getAttribute('latex');
        let newContent = window.prompt("LaTeX", content);
        if (newContent)
            this.setContent(newContent);
    }
}

function makeEditable(element, content, handler){
    return new Tooltip(element, content, handler);
}