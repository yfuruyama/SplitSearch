/*
 * injectedscript.js
 */

/*==========*/
/* function */
/*==========*/

function insertSplitLink() {
}
insertSplitLink();

function changeFrameContent() {
    console.log("changeFrame");
    var frame = document.getElementById("searchResultsFrame");
    frame.src = location.href;
}


