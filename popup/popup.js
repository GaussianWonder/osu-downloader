let settings = { // default state
    autoDownload: true,
};

const notifyTabsToUpdateSettings = () => {
    chrome.tabs.query({currentWindow: true}, (tabs) => {
        tabs.forEach(tab => {
            chrome.tabs.sendMessage(
                tab.id,
                {
                    type: "cs-update-settings",
                    data: settings,
                },
            );
        });
    });
}    

let autoDownloadElement = document.getElementById('auto-download');
autoDownloadElement.addEventListener('change', (event) => {
    settings.autoDownload = event.target.checked;
    chrome.storage.sync.set({settings: settings}, () => {
        notifyTabsToUpdateSettings();
    });
});

/**
 * Retreive initial settings
 */
chrome.storage.sync.get(['settings'], (data) => {
    if(data.settings !== undefined) { // might happen just the first time these get synced
        settings = data.settings;
        autoDownloadElement.checked = settings.autoDownload;
    }
    else { // whatever is stored in the storage is broken, update it
        chrome.storage.sync.set({settings: settings}, () => {
            notifyTabsToUpdateSettings();
        });
    }
});