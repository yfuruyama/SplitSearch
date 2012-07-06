/*
 * contentscript.js
 */

var SplitSearch = function() {
    this.init.apply(this);
}

SplitSearch.prototype = {

    // Constructor
    init: function() {
        this.mainWindow = new MainWindow();
        this.frameWindow = new FrameWindow();
    },

    injectScript: function(script) {
        var scriptEl = document.createElement("script");
        scriptEl.innerHTML = script;
        document.head.appendChild(scriptEl);
    },
};

var ss = new SplitSearch();
ss.mainWindow.setSplitLink();
ss.mainWindow.observeDocument();
