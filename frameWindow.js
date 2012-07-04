var fw = {

    initFrameWindow: function() {
        var div = document.createElement("div");
        div.style.display = "none";
        div.id = "framesetDiv";

        var frameSet = document.createElement("frameset");
        frameSet.style.display = "none";
        frameSet.cols = "*,*";
        // frameSet.setAttribute("frameborder", "0");
        frameSet.setAttribute("border", "1");
        // frameSet.setAttribute("framespacing", "0");

        var searchResultsFrame = document.createElement("frame");
        searchResultsFrame.id = "searchResultsFrame";
        searchResultsFrame.src = location.href;

        var pageFrame = document.createElement("frame");
        pageFrame.name = "pageFrame";
        pageFrame.id = "pageFrame";

        frameSet.appendChild(searchResultsFrame);
        frameSet.appendChild(pageFrame);
        div.appendChild(frameSet);
        document.body.appendChild(div);
    },
    
    getDocument: function() {
        var frame = document.getElementById("searchResultsFrame");
        return frame.contentDocument;
    },

    changeFrameSrc: function(url) {
        var frame = document.getElementById("searchResultsFrame");
        frame.src = url;
    },

    domChanged: function() {

        console.log("frameWindow: domChanged");

        numOfChanged = 0;
        fw.adjustGooglePage();
        ssObj.setSplitLink(fw.getDocument());
        fw.setReturnMWLink();
    },

    adjustGooglePage: function() {

        var doc = fw.getDocument();

        // Googleのページの要素
        var leftnavc = doc.getElementById("leftnavc");
        var center_col = doc.getElementById("center_col");
        var foot = doc.getElementById("foot");
        // console.log(leftnavc);
        // console.log(center_col);
        leftnavc.style.display = "none";
        center_col.style.marginLeft = "20px";
        foot.style.marginLeft = "40px";

        var fieldset = doc.getElementById("gbqff");
        fieldset.style.width = "300px";
        /*
        var button = doc.createElement("button");
        button.id = "leftSlideButton";
        button.style.position = "absolute";
        button.style.top = (document.body.scrollHeight/2) + "px";
        console.log("width = " + searchResultsFrame.width);
        button.style.left = (searchResultsFrame.width - 30) + "px";
        // button.style.left = "300px";
        button.innerHTML = "←";
        button.addEventListener("click", function(e) {
          clickSlideLeftButton(e);
          doc.body.removeChild(button);
        }, false);
        doc.body.appendChild(button);
        */
    },

    setReturnMWLink: function() {
        var doc = fw.getDocument();
        var links = doc.getElementsByClassName("r");
        for (var i = 0; i < links.length; i++) {
            var link = links[i].lastChild;
            link.addEventListener("click", function(evt) {
                console.log("ordinary link clicked");
                console.log(this);
                var linkUrl = evt.srcElement.href;
                console.log(linkUrl);

                // frameWindowを非表示に
                var framesetDiv = document.getElementById("framesetDiv");
                framesetDiv.style.display = "none";
                location.href = linkUrl;
            }); 
        }
    },
};
