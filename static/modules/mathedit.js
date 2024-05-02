
(async () => {
    const $ = Almagest;
    // BEGIN MODULE
    
    $.editor.quill.getModule("toolbar").addHandler("formula", () => {
        const sel = $.editor.quill.getSelection(true);
        if (sel.length) {
            // If some selection is active, take the selected text as LaTeX
            const latex = $.editor.quill.getText(sel);
            $.editor.quill.deleteText(sel.index, sel.length);
            $.editor.quill.theme.tooltip.edit("formula", latex);
            $.editor.quill.theme.tooltip.save();
        } else {
            // Otherwise, prompt the user for LaTeX
            $.editor.quill.theme.tooltip.edit("formula");
        }
    });
    
    // Ensure that all future formula has "click" event handler.
    const Formula = Quill.import("formats/formula");
    const origCreate = Formula.create;
    Formula.create = function (value) {
        const node = origCreate.call(this, value);
        node.addEventListener("dblclick", editFormula);
        return node;
    }
    
    // For formula that has already been created,
    // add "click" event handler manually one-by-one.
    document.querySelectorAll(".ql-editor .ql-formula").forEach(el => {
        el.addEventListener("dblclick", editFormula);
    });
    
    
    // Quill has a builtin tooltip facility. Unfortunately, it is very much
    // hardcoded and unusable except for editing links. (though fine for
    // inserting links, video, formula, and nothing else, as hardcoded.)
    
    // HACK: Overwrite the save, cancel and hide methods of Quill tooltip.
    // On hide, restore the original save, cancel and hide methods.
    function promptWithTooltip(type, value, saveFn, cancelFn) {
        const origSave = $.editor.quill.theme.tooltip.save;
        const origCancel = $.editor.quill.theme.tooltip.cancel;
        const origHide = $.editor.quill.theme.tooltip.hide;
    
        function wrap(fn) {
            return function() {
                if (fn) fn(this.textbox.value);
                this.textbox.value = "";
                this.hide();
            }
        }
    
        $.editor.quill.theme.tooltip.save = wrap(saveFn);
        $.editor.quill.theme.tooltip.cancel = wrap(cancelFn);
        $.editor.quill.theme.tooltip.hide = function () {
            this.save = origSave;
            this.cancel = origCancel;
            this.hide = origHide;
            this.hide();
        };
        $.editor.quill.theme.tooltip.edit(type, value);
    }
    
    function editFormula() {
        // Find the Formula Blot corresponding to the DOM node.
        // NOTE: Quill pre v2.0 uses Quill.import("parchment").find
        // and many texts on Internet still uses that.
        // However, Quill v2.0 has since then introduced "registry",
        // to support multiple Quill editors with different formats.
        const formula = $.editor.quill.options.registry.find(this);
        if (!(formula instanceof Formula)) return;
        promptWithTooltip("formula", formula.value().formula,
            (latex) => formula.replaceWith("formula", latex));
    }
    
    // END MODULE
    })();