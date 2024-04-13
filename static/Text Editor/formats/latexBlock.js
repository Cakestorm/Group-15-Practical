const Embed = Quill.import('blots/embed');

class LatexBlot extends Embed {
  static blotName = 'latexblock';
  static tagName = 'span';
  static className = 'latexblock';

  static create(content){
    let node = super.create();
    node.innerHTML = MathJax.tex2svg(content).innerHTML;
    node.setAttribute("latex", content);
    return node;
  }

  static value(node) {
    return node.getAttribute("latex");
  }
}

Quill.register(LatexBlot);