if (typeof window.Almagest !== "object") {
  window.Almagest = {}
}

((Almagest) => {
  const el = document.querySelector("#editor");
  Almagest.editor = new Quill(el);
})(window.Almagest);

