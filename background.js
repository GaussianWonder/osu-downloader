// Suggest a new download folder for any osu related downloads
chrome.downloads.onDeterminingFilename.addListener(function(downloadItem, __suggest) {
    const regexFilter = /https:\/\/(osu|bm\d*).ppy.sh\//gi;

    function suggest(filename, conflictAction) {
        __suggest({filename: filename,
                   conflictAction: conflictAction,
                   conflict_action: conflictAction});
    }

    if(downloadItem.url.match(regexFilter) !== null)
        suggest("osu-songs-symlink/" + downloadItem.filename);
});