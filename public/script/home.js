window.__mongodbui__ = (async (mongodbui, undefined) => {

    "use strict";

    class Home {
        
        /**
         * AJAX call to get collection list
         * @memberof Home
         * @returns Promise<Array<string>>
         */
        getCollections() {
            mongodbui.utility.http("/api/list")
                .then(response => document.getElementById("collections").innerHTML = JSON.stringify(response, null, 4))
                .catch(error => console.error(error));
        }
        
        /**
         * Binds DOM events
         * @memberof Home
         */
        bindEvents() {
            const menus = document.getElementsByClassName("menu-item");
            Array.prototype.slice.call(menus).forEach(el => {
                el.onclick = () => {
                    mongodbui.utility.injectTemplate(`${el.id}-template`);
                    history.pushState(null, null, `#${el.id}`);
                    el.id === "home" && this.getCollections();
                }
            });
        }

        /**
         * Initlaises home view
         * This is the application entry point
         * @param {*} document
         * @param {*} event
         * @memberof Home
         */
        init(document, event) {
            this.bindEvents();
            const hash = (location.hash || "#home").substring(1);
            mongodbui.utility.injectTemplate(`${hash}-template`);
            hash === "home" && this.getCollections();
        }
    }

    window.__mongodbui__.home = new Home();

    console.log("home registered!");    

    // bind application entry point to window.load event
    window.onload = mongodbui.home.init.bind(mongodbui.home);

    return mongodbui;

})(window.__mongodbui__ || {});