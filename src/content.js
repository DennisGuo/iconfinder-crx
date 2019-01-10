/**
 * Content scripts are the only component of an extension that has access to the web-page's DOM.
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {    
    if (request.code === 'PARSE_DOM') {
        var arr = document.querySelectorAll("[data-action=icon-details] >img");
        var links = [];
        arr.forEach(item => {
            links.push(item.getAttribute('src'));
        });
        sendResponse({ data: links, success: true });
    }
});