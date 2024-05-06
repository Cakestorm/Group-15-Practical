(async () => {
const $ = window.Almagest = {};
// BEGIN INIT

const ENDPOINT = "";
function restApi(resource) {
    // XXX: Consider conforming to the "conventional" REST endpoints
    // The current endpoints are unconventional and thus are less supported by
    // many developer toolings for REST API.
    //
    // The conventional endpoints are:
    // GET ${ENDPOINT}/${RESOURCE}/
    // GET ${ENDPOINT}/${RESOURCE}/${id}
    // PATCH ${ENDPOINT}/${RESOURCE}/${id}
    // DELETE ${ENDPOINT}/${RESOURCE}/${id}
    // (in that order)
    //
    // The current endpoints, mostly using POST, is additionally vulnerable to
    // CSRF once we decide to add authentication. (!!)
    return {
        async list() {
            const resp = await fetch(`${ENDPOINT}/${resource}_list`);
            return (await resp.json());
        },
        async get(id) {
            const resp = await fetch(`${ENDPOINT}/get_${resource}/${id}`);
            return await resp.json();
        },
        async create(data) {
            const id = data?.id || crypto.randomUUID();
            await fetch(`${ENDPOINT}/post_${resource}/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            return { id, ...data };
        },
        async update(id, data) {
            await fetch(`${ENDPOINT}/post_${resource}/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
        },
        async delete(id) {
            await fetch(`${ENDPOINT}/delete_${resource}/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
        },
    }
}

$.api = {
    note: restApi("note"),
    module: restApi("module"),
    async search(prompt) {
        const resp = await fetch("/search?q=" + encodeURIComponent(prompt));
        return resp.json();
    },
    async related(noteid) {
        const resp = await fetch(`/get_links/${noteid}`);
        return resp.json();
    },
};

$.api.module.load = async (module) => {
    await import(`/static/modules/${module}`);
};

$.config = {};

if (window?.localStorage?.getItem) {
    const initScript = localStorage.getItem("__init__");
    if (initScript) {
        await import(`data:application/javascript;base64,${btoa(initScript)}`);
        return;
    }
}

await $.api.module.load("core.js");

// END INIT
})();
