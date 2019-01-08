
/**
 * Popup btn functions.
 */
(function () {

    var textarea;
    var totalEl;
    var total;

    init();

    function init() {
        textarea = document.getElementById("text");
        totalEl = document.getElementById("total");
        let btnParse = document.getElementById("btn-parse");
        btnParse.onclick = parse;
        let btn = document.getElementById("btn");
        btn.onclick = download;
        textarea.onkeyup = textKeyup;

        setTotal(0);
    }

    /**
     * Watch textarea input.
     */
    function textKeyup(){
        let text = textarea.value.trim();
        setTotal(text.split("\n").length);
    }

    /**
     * Set the total info .
     * @param {*} num 
     */
    function setTotal(num,index){
        total = num;
        totalEl.innerHTML = index ? index + "/" + total : total;
    }

    /**
     * parse the page.
     */
    function parse() {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { code: 'PARSE_DOM' }, function (response) {
                var data = response.data;
                total = data.length;
                totalEl.innerHTML = total;
                textarea.value = data.join('\n');
            });
        });
    }

    /**
     * Execute download actions.
     */
    function download() {
        let text = textarea.value.trim();
        if (!text) {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.executeScript(
                    tabs[0].id,
                    { code: 'alert("Please enter at least one link.")' }
                );
            });
        } else {
            let links = text.split('\n');
            let index = 1;
            links.forEach(url=>{
                if(url.trim()){
                    chrome.downloads.download({
                        url:url.trim()
                    },(downloadId)=>{
                        setTotal(total,index)
                        index ++ ;
                    });
                }
            })
        }
    };
}())