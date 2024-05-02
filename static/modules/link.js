(async () => {
const $ = Almagest;
// BEGIN MODULE

document.querySelectorAll(".ql-editor a[target=_blank]").forEach((link)=> {
    if (link.getAttribute("href").startsWith("#")) {
        link.removeAttribute("target");
    }
});

const Link = Quill.import("formats/link");
const origCreate = Link.create;
Link.create = function(value) {
    const node = origCreate.call(this, value);
    if (node.getAttribute("href").startsWith("#")) {
        node.removeAttribute("target");
    }
    return node;
}

const origShow = $.editor.quill.theme.tooltip.__proto__.show;
$.editor.quill.theme.tooltip.__proto__.show = function(...args) {
    origShow.call(this, ...args);
    document.querySelectorAll(".ql-tooltip a[target=_blank]").forEach((link) => {
        if (link.getAttribute("href").startsWith("#")) {
            link.removeAttribute("target");
        }
    });
};

// END MODULE
})();
    