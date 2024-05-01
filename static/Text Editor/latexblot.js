// Define And Register The LaTeX Blot
const Embed = Quill.import('blots/embed');

class LatexBlot extends Embed {
    static blotName = 'latexblock';
    static tagName = 'span';
    static className = 'latexblock';

    static create(content){
        let element = super.create();
        element.setAttribute('latex', content);
        let handler = function(node, cont){
            katex.render(cont, node, {
                throwOnError: false
            });
        }
        makeEditable(element, content, handler);
        return element;
    }

    static value(node) {
        return node.getAttribute("latex");
    }
}
  
Quill.register(LatexBlot);