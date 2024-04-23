export const moduleData = {
    "name":"text_fade_in",
    "version":"1.0",
    "author":"Hera Brown",
    "isModuleSource":false,
    "loadOnPages":["editor"] 
};

/** Special thanks to Jacob for basically writing this module
  * for me - it's kinda just his word_counter, modified */
  
  /** Moved this to unused because it's probably more effort than it's
    * worth to get it working - I'd need to look into modifying Quill 
    * directly and that's far too much effort for ~1 week, sorry! */
export class Module {
    constructor(Handler) {
        this.handler = Handler;
    }
    
    onPageLoad() {
        let div = document.getElementById('editor');
        let quill = Quill.find(div);
        
        const Inline = Quill.import('blots/inline')
        
        class NewChar extends Inline {
            static blotName = 'nc';
            static tagName = 'div';
            static className='newChar';
            
            create(id){
                const node = super.create();
                return node;
            }

            formats(node){
                return 'id';
            }
        }

        Quill.register(NewChar);
        

        quill.on('text-change', (delta, oldDelta, source) => {
            if(source == 'api') return;

            if(source == 'user'){
              try{
                let lastChar = delta.ops[1].insert;
                let previousChar = "";
                
                previousChar = quill.getContents(quill.getSelection().index - 1, 1).ops[0].insert;               
                
                if(lastChar.length == 1
                && lastChar != " "
                && lastChar != "\n"){
                    if(previousChar != "\n")
                    {
                        quill.updateContents([
                        {retain:(quill.getSelection().index - 1)},
                        {delete: 1},
                        {insert: lastChar, attributes: {nc: true} }]);
                    }      

                    else{
                        quill.updateContents([
                        {retain:(quill.getSelection().index)},
                        {delete: 1},
                        {insert: lastChar, attributes: {nc: true} }]);
                    }
                }
              }
              catch { }
            }
        });
    }
}