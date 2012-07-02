/*
 * injectedscript.js
 */

/*==========*/
/* function */
/*==========*/

function insertSplitLink() {
    console.log("hello inject");
}


function changeFrameContent() {
    console.log("changeFrame");
    var frame = document.getElementById("searchResultsFrame");
    frame.src = location.href;
}


