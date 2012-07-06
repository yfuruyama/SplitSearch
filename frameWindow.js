/*
 * frameWindow.js
 */

var FrameWindow = function() {
    CommonWindow.apply(this);
    this.init.apply(this);
}

FrameWindow.prototype = {

    // Constructor
    init: function() {
        this.framesetDiv = this.createFrameset();
        this.searchFrame = this.framesetDiv.firstChild.firstChild;
        this.doc = undefined;
    },

    createFrameset: function() {
        var framesetDiv = document.createElement("div");
        framesetDiv.style.display = "none";
        framesetDiv.id = "framesetDiv";

        var frameSet = document.createElement("frameset");
        frameSet.style.display = "none";
        frameSet.cols = "*,*";
        frameSet.setAttribute("border", "1");
        // frameSet.setAttribute("frameborder", "0");
        // frameSet.setAttribute("framespacing", "0");

        var searchFrame = document.createElement("frame");
        searchFrame.id = "searchFrame";
        searchFrame.src = location.href;

        var pageFrame = document.createElement("frame");
        pageFrame.name = "pageFrame";
        pageFrame.id = "pageFrame";

        frameSet.appendChild(searchFrame);
        frameSet.appendChild(pageFrame);
        framesetDiv.appendChild(frameSet);
        document.body.appendChild(framesetDiv);

        return framesetDiv;
    },

    changeFrameSrc: function(url) {
        this.searchFrame.src = url;
    },

    adjustGooglePage: function() {
        var doc = this.doc;

        // element in Google page
        var leftnavc = doc.getElementById("leftnavc");
        var center_col = doc.getElementById("center_col");
        var foot = doc.getElementById("foot");
        var fieldset = doc.getElementById("gbqff");

        leftnavc.style.display = "none";
        center_col.style.marginLeft = "20px";
        foot.style.marginLeft = "40px";
        fieldset.style.width = "300px";
    },

    domChanged: function() {
        this.numOfLinksChanged = 0;
        this.adjustGooglePage();
        this.setSplitLink();
        this.setMainWindowLink();
    },

    setMainWindowLink: function() {
        var doc = this.doc;
        var links = doc.getElementsByClassName("r");
        for (var i = 0; i < links.length; i++) {
            var link = links[i].lastChild;
            link.addEventListener("click", function(evt) {
                // hide frameWindow
                var framesetDiv = ss.frameWindow.searchFrame.parentElement;
                framesetDiv.style.display = "none";

                var linkUrl = evt.srcElement.href;
                location.href = linkUrl;
            }); 
        }
    },
};
