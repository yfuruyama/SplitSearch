var fw = {

    numOfChanged: 0,
    NUM_OF_LINK: 10,

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

    changeContent: function(url) {
        var frame = document.getElementById("searchResultsFrame");
        frame.src = url;
    },

    observerCallback: function(mutations) {

        //console.log(fw.getDocument().getElementsByClassName("g").length);
        for (var i = 0, l = mutations.length; i < l; i++) {
            var mutation = mutations[i];
            if (mutation.addedNodes) {
                for (var j = 0, l2 = mutation.addedNodes.length; j < l2; j++) {
                    var node = mutation.addedNodes[j];
                    if (node instanceof HTMLLIElement) {
                        fw.numOfChanged++;
                        // 10個以上の検索結果が1つのページに表示された場合に調整
                        var numOfSearchResults = fw.getDocument().getElementsByClassName("g").length;
                        numOfSearchResults = (fw.NUM_OF_LINK > numOfSearchResults) ? fw.NUM_OF_LINK : numOfSearchResults;
                        if (fw.numOfChanged == numOfSearchResults) {
                            fw.domChanged();
                        }
                    }
                }
            }
        }
    },

    observeDocument: function() {

        var observer = new WebKitMutationObserver(fw.observerCallback);

        var observerConfig = {
            attributes: false,
            childList: true,
            characterData: true,
            subtree: true
        };

        observer.observe(fw.getDocument(), observerConfig);
    },

    domChanged: function() {

        console.log("frameWindow: domChanged");

        fw.numOfChanged = 0;
        fw.adjustGooglePage();
        setSplitLink(fw.getDocument());
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

                hideFrameWindow();
                location.href = linkUrl;
                //showMainWindow();
            }); 
        }
    },
};

/*
setInterval(function() {
    console.log(fw);
}, 5000);
*/
