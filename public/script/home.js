window.__mongodbui__ = ((mongodbui, undefined) => {

    "use strict";

    class Home extends mongodbui.Base {

        constructor(templateId) {
            super(templateId);
            this.table = null;
            this.listItemHtml = "";
            this.baseHtml = "";
            this.query = { pageNumber: 1, pageSize: 10, count: 0 };
        }

        async getCollections(query) {
            try {
                location.hash = btoa(JSON.stringify(this.query));
                const response = await mongodbui.apiClient.http("/api/list", "POST", query);
                response && response.isSuccess ?
                    this.rendeList(response.data) :
                    console.error(response.message);
            } catch (error) {
                console.error(error);
            }
        }

        rendeList(data) {
            if (!data || !data.collections || !Array.isArray(data.collections) || !data.collections.length) {
                this.table.innerHTML = this.baseHtml + `<h3 style="text-align:center;">no records found!</h3>`;
                return;
            }

            this.query.count = data.count;

            this.table.innerHTML = this.baseHtml + data.collections.reduce((html, item) => {
                html += this.listItemHtml.replace(new RegExp("{{name}}", 'g'), item);
                return html;
            }, "");

            const lblFilterStatus = document.getElementById("filterStatus");
            const start = ((this.query.pageNumber - 1) * this.query.pageSize) + 1;
            const end = (this.query.pageNumber * this.query.pageSize <= data.count ? this.query.pageNumber * this.query.pageSize : data.count);
            lblFilterStatus.innerHTML = `Showing ${start} to ${end} of ${data.count} records`;

            this.bindEvents();
        }

        bindEvents() {
            const menus = document.getElementsByClassName("show-documents");
            [].slice.call(menus).forEach(el => el.onclick = this.onMenuClick.bind(this));
            document.getElementById("search-collections").onclick = this.onSearch.bind(this);
        }

        onMenuClick(event) {
            console.log(event.target.dataset.collection);
        }

        onSearch() {
            const txtSearch = document.getElementById("txtSearch");
            const ddlPageSize = document.getElementById("ddlPageSize");
            const txtPageNumber = document.getElementById("txtPageNumber");
            const query = {
                name: (txtSearch.value || "").trim(),
                pageSize: parseInt(ddlPageSize.options[ddlPageSize.selectedIndex].value),
                pageNumber: parseInt(txtPageNumber.value || 1)
            };
            if (query.pageNumber < 0 || query.pageNumber > Math.ceil(this.query.count / query.pageSize)) {
                return alert("invalid page size!");
            }
            this.query = { ...this.query, ...query };
            this.getCollections(query);
        }

        init(doc, event) {
            this.injectTemplate();
            if (location.hash && location.hash.length > 1) {
                this.query = JSON.parse(atob(location.hash.substring(1)));
                document.getElementById("txtSearch").value = this.query.name;
                const ddlPageSize = document.getElementById("ddlPageSize").value = this.query.pageSize;
                const txtPageNumber = document.getElementById("txtPageNumber").value = this.query.pageNumber;
            }
            this.getCollections(this.query);
            this.table = document.getElementById("collection-table");
            this.baseHtml = this.table.innerHTML;
            this.listItemHtml = document.getElementById("list-item-template").innerHTML;
        }
    }

    mongodbui.home = new Home("home-template");

    window.onload = mongodbui.home.init.bind(mongodbui.home);

    return mongodbui;

})(window.__mongodbui__ || {});