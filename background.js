chrome.runtime.onInstalled.addListener(async (details) => {
    if(details.reason ==  chrome.runtime.OnInstalledReason.INSTALL) {
       openTab("welcome.html");
       await chrome.storage.local.set({wpm: 200});
    }
});

function openTab(path) {
    chrome.tabs.create({
        url: path
    })
}