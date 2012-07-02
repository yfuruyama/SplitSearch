/*
 * background.js
 */


/*==========*/
/* function */
/*==========*/

chrome.tabs.executeScript(null, {file: "injectedscript.js"});

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    chrome.tabs.executeScript(null, {code: request.code});
});
