chrome.runtime.onInstalled.addListener(details => {
    if(details.reason ==  chrome.runtime.OnInstalledReason.UPDATE) {
       openTab("welcome.html");
    }
});

function openTab(path) {
    chrome.tabs.create({
        url: path
    })
}