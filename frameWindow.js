var fw = {

    initFrameWindow: function() {
        var div = document.createElement("div");
        // div.style.display = "none";
        div.id = "targetDiv";

        var frameSet = document.createElement("frameset");
        // frameSet.style.display = "none";
        frameSet.cols = "*,*";
        frameSet.setAttribute("frameborder", "0");
        frameSet.setAttribute("border", "0");
        frameSet.setAttribute("framespacing", "0");

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
    },
};
