var mw = {

    isShowd: function() {
       var framesetDiv = document.getElementById("framesetDiv");
       return (framesetDiv.style.display == "none");
    },

    getDocument: function() {
        return window.document;
    },

    splitWindow: function() {
        // スクロール
        var scrollTop = document.body.scrollTop;
        // extension側からframe要素のcontentWindowを取得できなかったので、ページ側でスクロールさせる
        var scrollScript = "var searchResultsFrame = document.getElementById('searchResultsFrame');" + 
                           "searchResultsFrame.contentWindow.scrollTo(0," + scrollTop + ");";
        ssObj.injectScript(scrollScript);
        
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
        ssObj.setSplitLink(fw.getDocument());
        ssObj.observeDocument();

        // returnMWLink
        fw.setReturnMWLink();
    },
    
    domChanged: function() {
        numOfChanged = 0;
        console.log("mainWindow: domChanged");

        ssObj.setSplitLink(mw.getDocument());
        fw.changeFrameSrc(location.href);
    },
};
