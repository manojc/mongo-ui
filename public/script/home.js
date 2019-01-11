window.__mongodbui__ = ((mongodbui, undefined) => {

    "use strict";

    class Home extends mongodbui.Base {

        constructor(templateId) {
            super(templateId);
            this.table = null;
            this.listItemHtml = "";
            this.baseHtml = "";
        }

        async getCollections() {
            try {
                const response = await mongodbui.apiClient.http("/api/list");
                response && response.isSuccess ?
                    this.rendeList(response.data) :
                    console.error(response.message);
            } catch (error) {
                console.error(error);
            }
        }

        rendeList(list) {
            if (!list || !Array.isArray(list)) {
                return;
            }
            this.table.innerHTML = this.baseHtml + list.reduce((html, item) => {
                html += this.listItemHtml.replace(new RegExp("{{name}}", 'g'), item.name);
                return html;
            }, "");

            this.bindEvents();
        }

        bindEvents() {
            const menus = document.getElementsByClassName("show-documents");
            [].slice.call(menus).forEach(el => el.onclick = this.onMenuClick.bind(this));
        }

        onMenuClick(event) {
            console.log(event.target.dataset.collection);
        }

        init(doc, event) {
            this.injectTemplate();
            this.getCollections();
            this.table = document.getElementById("collection-table");
            this.baseHtml = this.table.innerHTML;
            this.listItemHtml = document.getElementById("list-item-template").innerHTML;
        }
    }

    mongodbui.home = new Home("home-template");

    window.onload = mongodbui.home.init.bind(mongodbui.home);

    return mongodbui;

})(window.__mongodbui__ || {});