/*
 * mainWindow.js
 */

var MainWindow = function() {
    CommonWindow.apply(this);
    this.init.apply(this);
}

MainWindow.prototype = {

    // Constructor
    init: function() {
        this.doc = window.document;
    },

    isShowed: function() {
        return (ss.frameWindow.framesetDiv.style.display == "none");
    },

    showFrameWindow: function() {

        if (!ss.frameWindow.doc) {
            ss.frameWindow.doc = ss.frameWindow.searchFrame.contentDocument;
        }

        console.log(ss.frameWindow);

        // scroll in page (can't get contentWindow of frame element from extension)
        var scrollTop = document.body.scrollTop;
        var scrollScript = "var searchFrame = document.getElementById('searchFrame');" + 
                            "searchFrame.contentWindow.scrollTo(0," + scrollTop + ");";
        ss.injectScript(scrollScript);
        
        // hide mainWindow
        for (var i = 0; i < document.body.childNodes.length; i++) {
            if (document.body.childNodes[i].style) {
                document.body.childNodes[i].style.display = "none";
            }
        }

        // show frameWindow
        var fw = ss.frameWindow;
        var framesetDiv = fw.framesetDiv;
        framesetDiv.style.display = "block";
        
        fw.adjustGooglePage();
        fw.setSplitLink();
        fw.observeDocument();
        fw.setMainWindowLink();
        fw.injectLoadCheckScript();
    },

    domChanged: function() {
        this.numOfLinksChanged = 0;
        this.setSplitLink();
        ss.frameWindow.changeFrameSrc(location.href);
    },
};
