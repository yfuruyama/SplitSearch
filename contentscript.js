/*
 * contentscript.js
 */

var ssObj = {
    isDomChanged: false,
    numOfChanged: 0,
    NUM_OF_LINK: 10,
    isMainWindowShowed: true
};

// window.onload = function() {
(function() {
  
    console.log("onLoad");
    
    setSplitLink(window.document);
    fw.initFrameWindow();
    mw.observeDocument();

    /*
    var script = "var searchResultsFrame = document.getElementById('searchResultsFrame');" + 
                 "searchResultsFrame.contentWindow.onload = function() {console.log('frame loaded');};";
    injectScript(script);
    */


})();
// }

function showFrame() {
}

function executeCodeInPage(executedCode) {
    chrome.extension.sendMessage({code: executedCode});
}

function setSplitLink(doc) {
    var rs = doc.getElementsByClassName("r");
    console.log("rs = ", rs);
    for (i = 0; i < rs.length; i++) {
        var r = rs[i];
        var link = r.childNodes[0];
        var splitLink = doc.createElement("a");
        var icon = doc.createElement("img");

        icon.src = chrome.extension.getURL("icon15x11.png");
        // icon.style.width = "20px";
        // icon.style.marginRight = "3px";
        // icon.style.marginBottom = "-2px";
        icon.style.width = "15px";
        icon.style.marginBottom = "0px";
        icon.style.marginRight = "5px";
        splitLink.href = link.href;
        splitLink.appendChild(icon);
        splitLink.className = "splitLink";
        splitLink.target = "pageFrame";
        splitLink.addEventListener("click", function() {
            if (ssObj.isMainWindowShowed) {
                mw.changeWindow();
            }
        });

        // setSplitLink(splitLink);

        r.appendChild(splitLink);
        r.appendChild(link);
    }
}

/*
function setSplitLink(link) {

    link.target = "pageFrame";

    link.addEventListener("click", function() {
        // 現在の縦スクロール量を取得
        var scrollTop = document.body.scrollTop;

        var searchResultsFrame = document.getElementById("searchResultsFrame");
        console.log(searchResultsFrame.contentWindow);

        // extension側からframe要素のcontentWindowを取得できなかったので、ページ側でスクロールさせる
        var scrollScript = "var searchResultsFrame = document.getElementById('searchResultsFrame');" + 
                           "searchResultsFrame.contentWindow.scrollTo(0," + scrollTop + ");";
        injectScript(scrollScript);

        // 画面にあるものを全部消す
        for (var i = 0; i < document.body.childNodes.length; i++) {
          if (document.body.childNodes[i].style) {
            document.body.childNodes[i].style.display = "none";
          }
        }

        var targetDiv = document.getElementById("targetDiv");
        console.log(targetDiv);
        targetDiv.style.display = "block";

        var searchResultsFrame = document.getElementById("searchResultsFrame");
        var doc = searchResultsFrame.contentDocument;

        // Googleのページの要素
        var leftnavc = doc.getElementById("leftnavc");
        var center_col = doc.getElementById("center_col");
        var foot = doc.getElementById("foot");
        console.log(leftnavc);
        console.log(center_col);
        leftnavc.style.display = "none";
        center_col.style.marginLeft = "20px";
        foot.style.marginLeft = "40px";

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

        var searchResultsLinks = doc.getElementsByClassName("l");
        for (var i = 0, l = searchResultsLinks.length; i < l; i++) {
          searchResultsLinks[i].target = "pageFrame";
        }

        var fieldset = doc.getElementById("gbqff");
        fieldset.style.width = "300px";
    }, false);
}
*/

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

function injectScript(script) {
  var scriptElem = document.createElement("script");
  scriptElem.innerHTML = script;
  document.head.appendChild(scriptElem);
}

function domChanged() {
    ssObj.numOfChanged = 0;
    console.log("domChanged");
    console.log(document.getElementsByClassName("g"));

    changeFrameContent();
    adujstGooglePage();
}

function changeFrameContent() {
    var newUrl = getCurrent();
    console.log(document.getElementById("searchResultsFrame").contentWindow);
    executeCodeInPage("changeFrameContent();");
}

function adjustGooglePage() {
    var searchResultsFrame = document.getElementById("searchResultsFrame");
    var doc = searchResultsFrame.contentDocument;

    // Googleのページの要素
    var leftnavc = doc.getElementById("leftnavc");
    var center_col = doc.getElementById("center_col");
    var foot = doc.getElementById("foot");
    console.log(leftnavc);
    console.log(center_col);
    leftnavc.style.display = "none";
    center_col.style.marginLeft = "20px";
    foot.style.marginLeft = "40px";

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
}

function getCurrent() {
    return location.href;
}

function observerCallback(windowObj) {

    for (var i = 0, l = mutations.length; i < l; i++) {
        var mutation = mutations[i];
        if (mutation.addedNodes) {
            for (var j = 0, l2 = mutation.addedNodes.length; j < l2; j++) {
                var node = mutation.addedNodes[j];
                if (node instanceof HTMLLIElement) {
                    windowObj.numOfChanged++;
                    // 10個以上の検索結果が1つのページに表示された場合に調整
                    var numOfSearchResults = windowObj.getDocument().getElementsByClassName("g").length;
                    numOfSearchResults = (windowObj.NUM_OF_LINK > numOfSearchResults) ? windowObj.NUM_OF_LINK : numOfSearchResults;
                    if (windowObj.numOfChanged == numOfSearchResults) {
                        windowObj.domChanged();
                    }
                }
            }
        }
    }
}

function showMainWindow() {
    var doc = mw.getDocument();
    // mainWindowを表示
    for (var i = 0; i < doc.body.childNodes.length; i++) {
        if (doc.body.childNodes[i].style) {
            doc.body.childNodes[i].style.display = "block";
        }
    }
}

function hideMainWindow() {
    var doc = mw.getDocument();
    // mainWindowを非表示
    for (var i = 0; i < doc.body.childNodes.length; i++) {
        if (doc.body.childNodes[i].style) {
            doc.body.childNodes[i].style.display = "none";
        }
    }
}

function hideFrameWindow() {
    var framesetDiv = document.getElementById("framesetDiv");
    framesetDiv.style.display = "none";
}


/*
var observer = new WebKitMutationObserver(function(mutations) {
    // console.log(mutations);
    
    //if (ssObj.isDomChanged) return;

    for (var i = 0, l = mutations.length; i < l; i++) {
        var mutation = mutations[i];
        // console.log(mutation);
        if (mutation.addedNodes) {
            for (var j = 0, l2 = mutation.addedNodes.length; j < l2; j++) {
                var node = mutation.addedNodes[j];
                if (node instanceof HTMLLIElement) {
                    //console.log(node);
                    ssObj.numOfChanged++;
                    if (ssObj.numOfChanged == ssObj.NUM_OF_LINK) {
                        domChanged();
                    }
                }
            }
        }
    }
});

var observerConfig = {
    attributes: false,
    childList: true,
    characterData: true,
    subtree: true
};

observer.observe(document, observerConfig);
*/
