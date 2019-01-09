(async (undefined) => {
    "use strict";

    // initialise namespace
    window.__mongodbui__ = window.__mongodbui__ || {};

    bindEvents();
    window.onload = init;

    // bind events
    function bindEvents() {
        const menus = document.getElementsByClassName("menu-item");
        Array.prototype.slice.call(menus).forEach(el => {
            el.onclick = () => {
                window.__mongodbui__.utils.injectTemplate(`${el.id}-template`);
                history.pushState(null, null, `#${el.id}`);
                el.id === "home" && getCollections();
            }
        });
    }

    // init home view
    function init(doc, e) {
        const hash = (location.hash || "#home").substring(1);
        window.__mongodbui__.utils.injectTemplate(`${hash}-template`);
        hash === "home" && getCollections();
    }

    // home view ajax call
    function getCollections() {
        window.__mongodbui__.utils.postData("/api/data", "GET")
            .then(response => document.getElementById("collections").innerHTML = JSON.stringify(response, null, 4))
            .catch(error => console.error(error));
    }

    window.__mongodbui__.home = window.__mongodbui__.home || {};
})();