(async () => {
const $ = Almagest;
// BEGIN MODULE

const counter = document.createElement("div");
counter.style.float = "right";
counter.style.marginTop = "0.25rem";
counter.style.marginRight = "1rem";
counter.style.color = "var(--alma-white)";
counter.style.fontFamily = "BasicHandwriting";
counter.style.fontSize = "16px";

counter.setAttribute("id", "counter");
counter.style.animationName = "juicyText";
counter.style.animationDuration = "0.3s";
counter.style.animationTimingFunction  = "ease"

function updateCounter() {
    const text = $.editor.quill.getText();
    const words = text.split(/\s+/).filter(str => /\w+/.test(str));
    
    /** Get the current number on the counter. */
    let oldNum = counter.textContent.split(" ")[0];
    
    if (words.length === 1) {
        counter.innerText = "1 word";
    } else {
        counter.innerText = `${words.length} words`;
    }
    
    /** Only do something if the number is different. */
    if(parseInt(oldNum) != words.length){
        /** Reset the animation. */
        counter.style.animation = 'none';
        counter.offsetHeight; 
        counter.style.animation = null; 
    }
}

document.querySelector("body > main .ql-toolbar").append(counter);

$.editor.quill.on("text-change", updateCounter);
addEventListener("almagest:note-loaded", updateCounter);
updateCounter();

// END MODULE
})();
