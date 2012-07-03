var mw = {

    numOfChanged: 0,
    NUM_OF_LINK: 10,

    getDocument: function() {
        return window.document;
    },

    changeWindow: function() {
        // スクロール
        var scrollTop = document.body.scrollTop;
        // extension側からframe要素のcontentWindowを取得できなかったので、ページ側でスクロールさせる
        var scrollScript = "var searchResultsFrame = document.getElementById('searchResultsFrame');" + 
                           "searchResultsFrame.contentWindow.scrollTo(0," + scrollTop + ");";
        injectScript(scrollScript);
        
        var frameDoc = fw.getDocument();

        // mainWindowを非表示
        for (var i = 0; i < document.body.childNodes.length; i++) {
            if (document.body.childNodes[i].style) {
                document.body.childNodes[i].style.display = "none";
            }
        }

        // frameWindowを表示
        var framesetDiv = document.getElementById("framesetDiv");
        console.log(framesetDiv);
        framesetDiv.style.display = "block";
        
        fw.adjustGooglePage();
        setSplitLink(fw.getDocument());
        fw.observeDocument();

        ssObj.isMainWindowShowed = false;

        // returnMWLink
        fw.setReturnMWLink();
    },
    
    domChanged: function() {
        mw.numOfChanged = 0;
        console.log("mainWindow: domChanged");

        setSplitLink(mw.getDocument());
        fw.changeContent(location.href);
        //adujstGooglePage();
    },
    
    observerCallback: function(mutations) {
    
        console.log("mainWindow: callback");
        //console.log(mw.getDocument().getElementsByClassName("g").length);

        for (var i = 0, l = mutations.length; i < l; i++) {
            var mutation = mutations[i];
            if (mutation.addedNodes) {
                for (var j = 0, l2 = mutation.addedNodes.length; j < l2; j++) {
                    var node = mutation.addedNodes[j];
                    if (node instanceof HTMLLIElement) {
                        mw.numOfChanged++;
                        // 10個以上の検索結果が1つのページに表示された場合に調整
                        var numOfSearchResults = mw.getDocument().getElementsByClassName("g").length;
                        numOfSearchResults = (mw.NUM_OF_LINK > numOfSearchResults) ? mw.NUM_OF_LINK : numOfSearchResults;
                        if (mw.numOfChanged == numOfSearchResults) {
                            mw.domChanged();
                        }
                    }
                }
            }
        }
    },

    observeDocument: function() {

        var observer = new WebKitMutationObserver(mw.observerCallback);

        var observerConfig = {
            attributes: false,
            childList: true,
            characterData: true,
            subtree: true
        };

        observer.observe(mw.getDocument(), observerConfig);
    },

};
