/*
 * commonWindow.js
 */

var CommonWindow = function() {

    this.numOfLinksChanged = 0;
    this.numOfDefaultLinks = 10;

    this.setSplitLink = function() {
        
        var doc = this.doc;
        var rs = doc.getElementsByClassName("r");

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
                if (ss.mainWindow.isShowed()) {
                    ss.mainWindow.showFrameWindow();
                }
            });

            r.appendChild(splitLink);
            r.appendChild(link);
        }
    };

    this.observeDocument =function() {
        var observer = new WebKitMutationObserver(this.observerCallback);

        var observerConfig = {
            attributes: false,
            childList: true,
            characterData: true,
            subtree: true
        };

        observer.observe(this.doc, observerConfig);
    };

    this.observerCallback = function(mutations) {

        var windowObj = ss.mainWindow.isShowed() ? ss.mainWindow : ss.frameWindow;

        for (var i = 0, l = mutations.length; i < l; i++) {
            var mutation = mutations[i];
            if (mutation.addedNodes) {
                for (var j = 0, l2 = mutation.addedNodes.length; j < l2; j++) {
                    var node = mutation.addedNodes[j];
                    if (node instanceof HTMLLIElement) {
                        windowObj.numOfLinksChanged++;
                        // 10個以上の検索結果が1つのページに表示された場合に調整
                        var numOfSearchResults = windowObj.doc.getElementsByClassName("g").length;
                        numOfSearchResults = (windowObj.numOfDefaultLinks > numOfSearchResults) ? windowObj.numOfDefaultsLinks : numOfSearchResults;
                        if (windowObj.numOfLinksChanged == numOfSearchResults) {
                            windowObj.domChanged();
                        }
                    }
                }
            }
        }
    };
}
