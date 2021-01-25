// Suppress the default osu download, and replace it
chrome.downloads.onDeterminingFilename.addListener(function(downloadItem, __suggest) {
    function suggest(filename, conflictAction) {
        __suggest({filename: filename,
                   conflictAction: conflictAction,
                   conflict_action: conflictAction});
    }

    if(downloadItem.url.includes("https://osu.ppy.sh/beatmapsets/")){ // this means that the download request was done by osu, so we want to overwrite it
        chrome.downloads.download(
            {
                url: downloadItem.finalUrl, // the workaround
                filename: "osu-songs-symlink/" + downloadItem.filename,
            }, 
            function(id) {
                console.log("new download");
                // if(downloadIDS.find(_id => _id === id ) != undefined)
                //     downloadIDS.push(id);

                // manual = false;
            }
        );

        chrome.downloads.cancel(downloadItem.id, function(){
            console.log("cancelled");
        });
    }
    else if (downloadItem.url.includes("ppy.sh/")) // some other osu related download, but not from the main domain
        suggest("osu-songs-symlink/" + downloadItem.filename);
});