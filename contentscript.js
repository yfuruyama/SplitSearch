/*
 * contentscript.js
 */

var ssObj = {
    numOfChanged: 0,
    NUM_OF_LINK: 10,

    init: function() {
        console.log("onLoad");
        
        ssObj.setSplitLink(window.document);
        fw.initFrameWindow();
        ssObj.observeDocument();
    },

    setSplitLink: function(doc) {
        var rs = doc.getElementsByClassName("r");
        console.log("rs = ", rs);
        for (i = 0; i < rs.length; i++) {
            var r = rs[i];
            var link = r.childNodes[0];
            var splitLink = doc.createElement("a");
            var icon = doc.createElement("img");

            icon.src = chrome.extension.getURL("icon15x11.png");
            icon.style.width = "15px";
            icon.style.marginBottom = "0px";
            icon.style.marginRight = "5px";
            splitLink.href = link.href;
            splitLink.appendChild(icon);
            splitLink.className = "splitLink";
            splitLink.target = "pageFrame";
            splitLink.addEventListener("click", function() {
                if (mw.isShowed) {
                    mw.splitWindow();
                }
            });

            r.appendChild(splitLink);
            r.appendChild(link);
        }
    },

    observeDocument: function() {
        var observer = new WebKitMutationObserver(observerCallback);

        var observerConfig = {
            attributes: false,
            childList: true,
            characterData: true,
            subtree: true
        };

        var doc = mw.isShowed() ? mw.getDocument() : fw.getDocument();

        observer.observe(doc, observerConfig);
    },

    observerCallback: function(mutations) {
        var windowObj = mw.isShowed() ? mw : fw;

        for (var i = 0, l = mutations.length; i < l; i++) {
            var mutation = mutations[i];
            if (mutation.addedNodes) {
                for (var j = 0, l2 = mutation.addedNodes.length; j < l2; j++) {
                    var node = mutation.addedNodes[j];
                    if (node instanceof HTMLLIElement) {
                        ssObj.numOfChanged++;
                        // 10個以上の検索結果が1つのページに表示された場合に調整
                        var numOfSearchResults = windowObj.getDocument().getElementsByClassName("g").length;
                        numOfSearchResults = (ssObj.NUM_OF_LINK > numOfSearchResults) ? ssObj.NUM_OF_LINK : numOfSearchResults;
                        if (ssObj.numOfChanged == numOfSearchResults) {
                            windowObj.domChanged();
                        }
                    }
                }
            }
        }
    },

    injectScript: function(script) {
        var scriptElem = document.createElement("script");
        scriptElem.innerHTML = script;
        document.head.appendChild(scriptElem);
    },

    executeCodeInPage: function(executedCode) {
        chrome.extension.sendMessage({code: executedCode});
    }

}

ssObj.init();

