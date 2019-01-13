window.__mongodbui__ = ((mongodbui, undefined) => {

    "use strict";

    class Home extends mongodbui.Base {

        constructor(templateId) {
            super(templateId);
            this.table = null;
            this.listItemHtml = "";
            this.baseHtml = "";
            this.query = { n: "", pn: 1, ps: 10 };
        }

        async getCollections(query) {
            try {
                const response = await mongodbui.apiClient.http("/api/collections", "POST", query);
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
                document.getElementById("filterStatus").innerHTML = "no records found!";
                return;
            }

            this.table.innerHTML = this.baseHtml + data.collections.reduce((html, item) => {
                const row = this.listItemHtml.replace(new RegExp("{{name}}", 'g'), item.name);
                html += row.replace(new RegExp("{{count}}", 'g'), item.count);
                return html;
            }, "");

            const lblFilterStatus = document.getElementById("filterStatus");
            const start = ((this.query.pn - 1) * this.query.ps) + 1;
            const end = (this.query.pn * this.query.ps <= data.c ? this.query.pn * this.query.ps : data.c);
            lblFilterStatus.innerHTML = `Showing ${start} to ${end} of ${data.c} record(s)`;

            const menus = document.getElementsByClassName("show-documents");
            [].slice.call(menus).forEach(el => el.onclick = this.onMenuClick.bind(this));
            this.bindEvents();
        }

        bindEvents() {
            document.getElementById("search-collections").onclick = this.onSearch.bind(this);
            document.getElementById("title").onclick = () =>
                location.hash = btoa(JSON.stringify({ n: "", pn: 1, ps: 10, c: 0 }));
        }

        async onMenuClick(event) {
            try {
                const query = { ...this.query };
                query.n = event.target.dataset.collection;
                await mongodbui.apiClient.http("/api/documents", "POST", query);
            } catch (error) {
                console.error(error);
            }
        }

        onSearch() {
            const txtSearch = document.getElementById("txtSearch");
            const ddlPageSize = document.getElementById("ddlPageSize");
            const txtPageNumber = document.getElementById("txtPageNumber");
            this.query = {
                n: (txtSearch.value || "").trim(),
                ps: parseInt(ddlPageSize.options[ddlPageSize.selectedIndex].value),
                pn: parseInt(txtPageNumber.value || 1)
            };
            if (this.query.pn < 0) {
                return alert("invalid page size!");
            }
            location.hash = btoa(JSON.stringify(this.query));
        }

        setContainerHeight() {
            const tableContainer = document.getElementsByClassName("table-container")[0];
            tableContainer.style.maxHeight = `${window.innerHeight - 180}px`;
            tableContainer.style.height = tableContainer.style.maxHeight;
        }

        onLoad() {
            this.init();
            this.setContainerHeight();
        }

        init() {
            this.injectTemplate();
            this.bindEvents();
            if (location.hash && location.hash.length > 1) {
                this.query = JSON.parse(atob(location.hash.substring(1)));
            } else {
                location.hash = btoa(JSON.stringify(this.query));
                return;
            }
            // populate query values
            document.getElementById("txtSearch").value = this.query.n;
            const ddlPageSize = document.getElementById("ddlPageSize").value = this.query.ps;
            const txtPageNumber = document.getElementById("txtPageNumber").value = this.query.pn;

            this.getCollections(this.query);
            this.table = document.getElementById("collection-table");
            this.baseHtml = this.table.innerHTML;
            this.listItemHtml = document.getElementById("list-item-template").innerHTML;
        }
    }

    mongodbui.home = new Home("home-template");

    window.onload = mongodbui.home.onLoad.bind(mongodbui.home);
    window.onhashchange = mongodbui.home.init.bind(mongodbui.home);
    window.onresize = mongodbui.home.setContainerHeight.bind(mongodbui.home);

    return mongodbui;

})(window.__mongodbui__ || {});