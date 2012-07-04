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

        var colScrollScript = "var searchResultsFrame = document.getElementById('searchResultsFrame');" + 
                              "searchResultsFrame.contentWindow.onscroll = function() {" +
                                "var doc = searchResultsFrame.contentDocument;" +
                                "doc.getElementById('leftSlideButton').style.top = doc.body.scrollTop;" + 
                              "};";
        injectScript(colScrollScript);
        */
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
    }

}

ssObj.init();


// release ver2.0
var dx;
function clickSlideLeftButton(e) {
  console.log("slide: ", e);
  console.log(this);
  var frameset = document.getElementsByTagName("frameset")[0];
  dx = 0;
  startSlide(frameset, document.body.scrollWidth/2);
}

function startSlide(frameset, leftPosition) {
  slideTimer = setInterval(function() {
    if (leftPosition - dx <= 0) {
      dx = 0;
      frameset.cols = "0,*";
      clearInterval(slideTimer);
      return;
    }
    frameset.cols = (leftPosition - dx) + ",*";
    dx += 50;
  }, 30);
}

function executeCodeInPage(executedCode) {
    chrome.extension.sendMessage({code: executedCode});
}
