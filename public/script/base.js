window.__mongodbui__ = ((mongodbui, undefined) => {

    "use strict";

    mongodbui.Base = class Base {

        constructor(templateId) {
            this.templateId = templateId;
        }

        injectTemplate(name = null, outlet = "outlet") {
            this.templateId = name || this.templateId;
            document.getElementById(outlet).innerHTML = document.getElementById(this.templateId).innerHTML;
        }
    }

    return mongodbui;

})(window.__mongodbui__ || {});