/*
 * contentscript.js
 */


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
    // setTimeout(function() {
      /*
      var links = document.getElementsByClassName("l");
      arrayOfHref = new Array();
      for (var i = 0; i < links.length; i++) {
        var link = links[i];
        arrayOfHref.push(link.href);
        console.log(arrayOfHref);
        link.style.color = "#12c";
        link.style.cursor = "pointer";
        link.style.textDecoration = "underline";
        link.addEventListener("click", function() {

          var frameSet = document.createElement("frameset");
          frameSet.cols = "*,*";

          var iframeTag = document.createElement("frame");
          // iframeTag.style.width = document.body.scrollWidth / 2;
          // iframeTag.style.height = document.body.scrollHeight;
          // iframeTag.style.width = "600px";
          // iframeTag.style.height = "800px";
          iframeTag.id = "splitFrame";
          iframeTag.src = location.href;
          while(document.body.hasChildNodes()) {
            document.body.removeChild(document.body.lastChild);
          }
          document.body.appendChild(iframeTag);
      
          var pageFrame = document.createElement("frame");
          pageFrame.src = arrayOfHref[0];
          // pageFrame.style.width = document.body.scrollWidth / 2;
          // pageFrame.style.height = document.body.scrollHeight;

          frameSet.appendChild(iframeTag);
          frameSet.appendChild(pageFrame);
          document.body.appendChild(frameSet);
        }, false);
        link.removeAttribute("href");
      }
      */

/*
      var searchResultsFrame = document.createElement("frame");
      searchResultsFrame.id = "searchResultsFrame";
      document.body.appendChild(searchResultsFrame);

      searchResultsFrame = document.getElementById("searchResultsFrame");
      searchResultsFrame.style.width = "600px";
      searchResultsFrame.style.height = "800px";
      // contentWindowだとundefinedが返ってくる
      var searchResultsBody = searchResultsFrame.contentDocument.body;
      var searchResultsHead = searchResultsFrame.contentDocument.head;
      for (var i = 0; i < document.body.childNodes.length; i++) {
        if (document.body.childNodes[i] && document.body.childNodes[i].id == "searchResultsFrame") {
          continue;
        }
        var dupBody = document.body.childNodes[i].cloneNode(true);
        searchResultsBody.appendChild(dupBody);
      }
      for (var i = 0; i < document.head.childNodes.length; i++) {
        var dupHead = document.head.childNodes[i].cloneNode(true);
        searchResultsHead.appendChild(dupHead);
      }
      while (document.body.hasChildNodes()) {
        if (document.body.childNodes[i] && document.body.childNodes[i].id == "searchResultsFrame") {
          continue;
        }
        document.body.removeChild(document.body.childNodes[i]);
      }
      while (document.head.hasChildNodes()) {
        document.head.removeChild(document.head.lastChild);
      }
      */


      
    // }, 3000);
  
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
    // checkDomLoad(dummyDoc);
  }, 100);
  // document.body.appendChild(searchResultsFrame);
})();


function checkDomLoad(dummyBody) {

  // if (document.body) {
  var links = document.getElementsByClassName("l");
  if (links.length != 0) {
    clearInterval(timerId);
    console.log("dom loaded");

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
    // searchResultsFrame.width = document.body.scrollWidth / 2;
    // searchResultsFrame.height = document.body.scrollHeight;
    // searchResultsFrame.style.display = "none";


    var pageFrame = document.createElement("frame");
    // pageFrame.width = document.body.scrollWidth / 2;
    // pageFrame.height = document.body.scrollHeight;
    // pageFrame.style.position = "absolute";
    // pageFrame.style.top = 0;
    // pageFrame.style.left = document.body.scrollWidth / 2 + "px";
    pageFrame.name = "pageFrame";
    pageFrame.id = "pageFrame";
    // pageFrame.style.display = "none";

    frameSet.appendChild(searchResultsFrame);
    frameSet.appendChild(pageFrame);
    // iframe.contentDocument.body.appendChild(frameSet);
    // iframe.contentDocument.body.style.margin = 0;
    div.appendChild(frameSet);
    document.body.appendChild(div);

    setTimeout(function() {
      var links = document.getElementsByClassName("l");
      arrayOfHref = new Array();
      for (var i = 0; i < links.length; i++) {
        var link = links[i];
        // arrayOfHref.push(link.href);
        // link.style.color = "#12c";
        // link.style.cursor = "pointer";
        // link.style.textDecoration = "underline";
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

          // searchResultsFrame.contentWindow.scrollTo(0, scrollTop);

          var searchResultsLinks = doc.getElementsByClassName("l");
          for (var i = 0, l = searchResultsLinks.length; i < l; i++) {
            searchResultsLinks[i].target = "pageFrame";
          }

          var fieldset = doc.getElementById("gbqff");
          fieldset.style.width = "300px";
          // var targetIFrame = document.getElementById("targetIFrame");
          // console.log(targetIFrame);
          // targetIFrame.style.display = "block";

          // var searchResultsFrame = document.getElementById("searchResultsFrame");
          // searchResultsFrame.style.display = "block";
          // var pageFrame = document.getElementById("pageFrame");
          // pageFrame.style.display = "block";

        }, false);
        // link.removeAttribute("href");
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
