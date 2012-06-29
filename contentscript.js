/*
 * contentscript.js
 */

/*===============*/
/* global object */
/*===============*/
var ssObj;

/*===================*/
/* Constant Variable */
/*===================*/

/*==========*/
/* varialbe */
/*==========*/

var arrayOfHref;

/*============*/
/* initialize */
/*============*/

(function() {
  
  var searchResultsFrame = document.createElement("iframe");
  searchResultsFrame.id = "searchResultsFrame";
  searchResultsFrame.src = location.href;
  console.log(document);
  console.log(document.body);
  var dummyDoc = document.implementation.createDocument ('http://www.w3.org/1999/xhtml', 'html', null);
  var dummyBody = document.createElementNS('http://www.w3.org/1999/xhtml', 'body');
  dummyBody.appendChild(searchResultsFrame);
  timerId = setInterval(function() {
    checkDomLoad(dummyBody);
  }, 100);
})();


function checkDomLoad(dummyBody) {

  var rs = document.getElementsByClassName("r");
  if (rs.length != 0) {
    clearInterval(timerId);
    console.log("dom loaded");

    for (i = 0; i < rs.length; i++) {
      var r = rs[i];
      var link = r.childNodes[0];
      var splitLink = document.createElement("a");
      var icon = document.createElement("img");

      icon.src = chrome.extension.getURL("icon.png");
      icon.style.width = "20px";
      icon.style.marginRight = "5px";
      splitLink.href = link.href;
      splitLink.appendChild(icon);
      splitLink.className = "splitLink";

      r.appendChild(splitLink);
      r.appendChild(link);
    }

    var div = document.createElement("div");
    div.style.display = "none";
    div.id = "targetDiv";

    var frameSet = document.createElement("frameset");
    // // これが効かない
    frameSet.style.display = "none";
    frameSet.cols = "*,*";

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

    setTimeout(function() {
      var links = document.getElementsByClassName("splitLink");
      arrayOfHref = new Array();
      for (var i = 0; i < links.length; i++) {
        var link = links[i];
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
      console.log(arrayOfHref);
    }, 1000);

  }
}

var slideTimer;
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
