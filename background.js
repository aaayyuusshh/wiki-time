chrome.runtime.onInstalled.addListener(async (details) => {
    if(details.reason ==  chrome.runtime.OnInstalledReason.INSTALL) {
        await chrome.action.setBadgeText({text: "on"});
        // chrome.action.setBadgeBackgroundColor({color: "red"});
        await chrome.storage.local.set({isExtensionOn: true});
        openTab("welcome.html");
        await chrome.storage.local.set({wpm: 200});
    } else { //UPDATE, CHROME_UPDATE, SHARED_MODULE_UPDATE
        let result = await chrome.storage.local.get("isExtensionOn");
        let isExtensionOn = result.isExtensionOn;
        let currentState = isExtensionOn ? "on" : "off";
        console.log(`[updated], current state: ${currentState}`);
        await chrome.action.setBadgeText({text: currentState});
    }
});

function openTab(path) {
    chrome.tabs.create({
        url: path
    })
}

// rerun content script when wpm value is changed through action popup
chrome.storage.onChanged.addListener(async (changes, areaName) => {
    if(areaName == "local" && changes.wpm) {
        // console.log(`old wpm: ${changes.wpm?.oldValue}, new wpm: ${changes.wpm?.newValue}`);
        let wikiTabs = await chrome.tabs.query({url: "https://en.wikipedia.org/wiki/*"});
        console.log(wikiTabs);
        wikiTabs.forEach((tab) => {
            // rerunning in the same context is causing variable scoping issues
            // just reload tabs for now as that will rerun the content script in a new context
            // chrome.scripting.executeScript({
            //     target: {tabId: tab.id},
            //     files: ["content.js"]
            // });
            chrome.tabs.reload(tab.id);
        });
    }

    if(areaName == "local" && changes.isExtensionOn) {
        console.log("change in on/off");
        let isExtensionOn = changes.isExtensionOn.newValue;
        let newState = isExtensionOn ? "on" : "off";
        chrome.action.setBadgeText({text: newState});
    }
});