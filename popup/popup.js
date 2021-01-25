/**
 * Query the content script for the download link
 */
const queryDownloadLink = () => {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
        var activeTab = tabs[0];
        // chrome.tabs.sendMessage(activeTab.id, {"message": "fetch"});
    });
}

// Init query + se interval setup
queryDownloadLink();
setInterval(queryDownloadLink, 650);

// Elements and relevant data
let downloadLinkAnchorElement = document.getElementById('download-link');
let previousDownloaded = '';
let downloadIDS = [];

downloadLinkAnchorElement.addEventListener("click", (evt) => {
    evt.preventDefault();
    manualDownload();
    return false;
});

// Listener for the download link from the content script
// chrome.extension.onRequest.addListener(function(downloadLink) {
//     if((typeof downloadLink === 'string' || downloadLink instanceof String) && downloadLink.length !== 0) {
//         if(downloadLink === previousDownloaded) // do not redownload the same thing again
//             return;
        
//         previousDownloaded = downloadLink;
//         downloadLinkAnchorElement.setAttribute('href', downloadLink);

//         chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
//             var activeTab = tabs[0];
//             // chrome.tabs.sendMessage(activeTab.id, {"message": "download"});
//         });
//     }
// });

// Button on click callback
const manualDownload = () => {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
        var activeTab = tabs[0];
        // chrome.tabs.sendMessage(activeTab.id, {"message": "download"});
    });
}