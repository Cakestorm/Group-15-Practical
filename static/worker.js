const VERSION = "v0";
const CACHE_NAME = `almagest-${VERSION}`;
const APP_STATIC_RESOURCES = [
    "/",
    "/static/install.html",
    "/static/manifest.json",
    "/static/almastyle.css",
    "/static/init.js",
    "/static/img/logo-light.png",
    "/static/img/logo-dark.png",
    "/static/img/favicon-16.png",
    "/static/img/favicon-32.png",
    "/static/img/favicon-48.png",
    "/static/img/favicon-57.png",
    "/static/img/favicon-64.png",
    "/static/img/favicon-72.png",
    "/static/img/favicon-114.png",
    "/static/img/favicon-144.png",
    "/static/img/favicon-167.png",
    "/static/img/favicon-180.png",
    "/static/img/favicon-192.png",
    "/static/lib/quill/quill.js",
    "/static/lib/quill/quill.snow.css",
    "/static/lib/katex/katex.min.js",
    "/static/lib/katex/katex.min.css",
    "/static/lib/katex/fonts/KaTeX_AMS-Regular.ttf",
    "/static/lib/katex/fonts/KaTeX_AMS-Regular.woff",
    "/static/lib/katex/fonts/KaTeX_AMS-Regular.woff2",
    "/static/lib/katex/fonts/KaTeX_Caligraphic-Bold.ttf",
    "/static/lib/katex/fonts/KaTeX_Caligraphic-Bold.woff",
    "/static/lib/katex/fonts/KaTeX_Caligraphic-Bold.woff2",
    "/static/lib/katex/fonts/KaTeX_Caligraphic-Regular.ttf",
    "/static/lib/katex/fonts/KaTeX_Caligraphic-Regular.woff",
    "/static/lib/katex/fonts/KaTeX_Caligraphic-Regular.woff2",
    "/static/lib/katex/fonts/KaTeX_Fraktur-Bold.ttf",
    "/static/lib/katex/fonts/KaTeX_Fraktur-Bold.woff",
    "/static/lib/katex/fonts/KaTeX_Fraktur-Bold.woff2",
    "/static/lib/katex/fonts/KaTeX_Fraktur-Regular.ttf",
    "/static/lib/katex/fonts/KaTeX_Fraktur-Regular.woff",
    "/static/lib/katex/fonts/KaTeX_Fraktur-Regular.woff2",
    "/static/lib/katex/fonts/KaTeX_Main-Bold.ttf",
    "/static/lib/katex/fonts/KaTeX_Main-Bold.woff",
    "/static/lib/katex/fonts/KaTeX_Main-Bold.woff2",
    "/static/lib/katex/fonts/KaTeX_Main-BoldItalic.ttf",
    "/static/lib/katex/fonts/KaTeX_Main-BoldItalic.woff",
    "/static/lib/katex/fonts/KaTeX_Main-BoldItalic.woff2",
    "/static/lib/katex/fonts/KaTeX_Main-Italic.ttf",
    "/static/lib/katex/fonts/KaTeX_Main-Italic.woff",
    "/static/lib/katex/fonts/KaTeX_Main-Italic.woff2",
    "/static/lib/katex/fonts/KaTeX_Main-Regular.ttf",
    "/static/lib/katex/fonts/KaTeX_Main-Regular.woff",
    "/static/lib/katex/fonts/KaTeX_Main-Regular.woff2",
    "/static/lib/katex/fonts/KaTeX_Math-BoldItalic.ttf",
    "/static/lib/katex/fonts/KaTeX_Math-BoldItalic.woff",
    "/static/lib/katex/fonts/KaTeX_Math-BoldItalic.woff2",
    "/static/lib/katex/fonts/KaTeX_Math-Italic.ttf",
    "/static/lib/katex/fonts/KaTeX_Math-Italic.woff",
    "/static/lib/katex/fonts/KaTeX_Math-Italic.woff2",
    "/static/lib/katex/fonts/KaTeX_SansSerif-Bold.ttf",
    "/static/lib/katex/fonts/KaTeX_SansSerif-Bold.woff",
    "/static/lib/katex/fonts/KaTeX_SansSerif-Bold.woff2",
    "/static/lib/katex/fonts/KaTeX_SansSerif-Italic.ttf",
    "/static/lib/katex/fonts/KaTeX_SansSerif-Italic.woff",
    "/static/lib/katex/fonts/KaTeX_SansSerif-Italic.woff2",
    "/static/lib/katex/fonts/KaTeX_SansSerif-Regular.ttf",
    "/static/lib/katex/fonts/KaTeX_SansSerif-Regular.woff",
    "/static/lib/katex/fonts/KaTeX_SansSerif-Regular.woff2",
    "/static/lib/katex/fonts/KaTeX_Script-Regular.ttf",
    "/static/lib/katex/fonts/KaTeX_Script-Regular.woff",
    "/static/lib/katex/fonts/KaTeX_Script-Regular.woff2",
    "/static/lib/katex/fonts/KaTeX_Size1-Regular.ttf",
    "/static/lib/katex/fonts/KaTeX_Size1-Regular.woff",
    "/static/lib/katex/fonts/KaTeX_Size1-Regular.woff2",
    "/static/lib/katex/fonts/KaTeX_Size2-Regular.ttf",
    "/static/lib/katex/fonts/KaTeX_Size2-Regular.woff",
    "/static/lib/katex/fonts/KaTeX_Size2-Regular.woff2",
    "/static/lib/katex/fonts/KaTeX_Size3-Regular.ttf",
    "/static/lib/katex/fonts/KaTeX_Size3-Regular.woff",
    "/static/lib/katex/fonts/KaTeX_Size3-Regular.woff2",
    "/static/lib/katex/fonts/KaTeX_Size4-Regular.ttf",
    "/static/lib/katex/fonts/KaTeX_Size4-Regular.woff",
    "/static/lib/katex/fonts/KaTeX_Size4-Regular.woff2",
    "/static/lib/katex/fonts/KaTeX_Typewriter-Regular.ttf",
    "/static/lib/katex/fonts/KaTeX_Typewriter-Regular.woff",
    "/static/lib/katex/fonts/KaTeX_Typewriter-Regular.woff2",
];

self.addEventListener("install", (ev) => {
    ev.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);
        cache.addAll(APP_STATIC_RESOURCES);
        cache.put("/static/index.html", await cache.match("/"));
    })());
});

self.addEventListener("activate", (ev) => {
    ev.waitUntil((async () => {
        const keys = await caches.keys();
        const obsolete = keys.filter(key => key !== CACHE_NAME);
        await Promise.all(obsolete.map(key => caches.delete(key)));
        await clients.claim();
    })());
});

self.addEventListener("fetch", (ev) => {
    ev.respondWith((async () => {
        const cache = await caches.open(CACHE_NAME);
        const resp = await cache.match(ev.request.url);
        return (resp || new Response(null, { status: 404 }));
    })());
});
