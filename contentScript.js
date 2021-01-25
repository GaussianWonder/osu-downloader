/**
 * Utility funtion
 * @param {*} path String containing the XPATH to the desired element
 * @param {*} contextNode Context node, if applicable
 */
const getElementByXPath = (path, contextNode = document) => {
    return document.evaluate(path, contextNode, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

/**
 * Utility funtion
 * @param {*} path String containing the XPATH to the desired element
 * @param {*} contextNode Context node, if applicable
 */
const countXPath = (path, contextNode = document) => {
    return document.evaluate("count(" + path + ")", contextNode, null, XPathResult.NUMBER_TYPE, null).numberValue;
}

/**
 * Main script that starts the download process
 */
let downloadLink = '';
let withoutVideoDownloadAnchorElement = null;
const fetchDownloadLink = (beatMapHeader) => {
    let beatMapDownloadAnchorXPath = '//a[@class="btn-osu-big btn-osu-big--beatmapset-header js-beatmapset-download-link"]';
    let beatMapAnchorRelativeFilter = '/span/span[@class="btn-osu-big__left"]/span[contains(text(),"without Video")]/../../..';

    withoutVideoDownloadAnchorElement = getElementByXPath(beatMapDownloadAnchorXPath + beatMapAnchorRelativeFilter, beatMapHeader);
    if(withoutVideoDownloadAnchorElement === null) {
        // this means that there is only one download button, so we just remove the relative filtering
        withoutVideoDownloadAnchorElement = getElementByXPath(beatMapDownloadAnchorXPath, beatMapHeader);
    }

    downloadLink = withoutVideoDownloadAnchorElement.href;
    withoutVideoDownloadAnchorElement.click();
    // When reaching this guy, 'manual' will be set to false
    // Note: this is extension-wide, so any downloads started when manual == true will receive the Save As prompt
    // Manual should be only used when automatic is disabled :))
}

/**
 * Starts the main script once it has all the required data
 */
let beatMapSetHeaderXPathFinderInterval = null;
let beatMapSetHeaderXPath = null;
let beatMapSetHeaderElement = null;
const fetchBaseDOMElement = () => {
    // Try fast fetching the beatmap header element
    beatMapSetHeaderXPathFinderInterval = null;
    beatMapSetHeaderXPath = '/html/body/div[7]/div/div/div[2]/div[1]/div/div[2]/div[3]';
    beatMapSetHeaderElement = getElementByXPath(beatMapSetHeaderXPath);

    // If that fails, try fetching it via the class attribute
    if(beatMapSetHeaderElement === null) {
        beatMapSetHeaderXPath = '//div[@class="beatmapset-header__buttons"]';

        beatMapSetHeaderXPathFinderInterval = setInterval(function() {
            beatMapSetHeaderElement = getElementByXPath(beatMapSetHeaderXPath);
            if(beatMapSetHeaderElement !== null) {
                clearInterval(beatMapSetHeaderXPathFinderInterval);
                fetchDownloadLink(beatMapSetHeaderElement);
            }
        }, 350);
    }
    else 
        fetchDownloadLink(beatMapSetHeaderElement);
}
fetchBaseDOMElement();

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    if(request.message === "fetch") {
        // chrome.extension.sendRequest(downloadLink);
    }
    else if(request.message === "download") {
        fetchBaseDOMElement();
        withoutVideoDownloadAnchorElement.click();
    }
    else if(request.message === "update") {
        fetchBaseDOMElement();
    }
});