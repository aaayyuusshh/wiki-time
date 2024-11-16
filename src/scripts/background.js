async function setup() {
    await chrome.storage.local.set({ isExtensionOn: true });
    await chrome.storage.local.set({ wpm: 200 });
}

function openTab(path) {
    chrome.tabs.create({
        url: path
    });
}

async function refreshWikiTabs() {
    const wikiTabs = await chrome.tabs.query({ url: "https://en.wikipedia.org/wiki/*" });
    wikiTabs.forEach((tab) => {
        chrome.tabs.reload(tab.id);
    });
}

async function reExecuteContentScript() {
    const wikiTabs = await chrome.tabs.query({ url: "https://en.wikipedia.org/wiki/*" });
    wikiTabs.forEach((tab) => {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["content.js"]
        });
    });
}

async function setCurrentBadgeText(isExtensionOn) {
    const currentState = isExtensionOn ? "on" : "off";
    await chrome.action.setBadgeText({ text: currentState });
}

chrome.runtime.onInstalled.addListener(async (details) => {
    if (details.reason == chrome.runtime.OnInstalledReason.INSTALL) {
        await setup();
        openTab("../index/welcome.html");
    } else {
        //UPDATE, CHROME_UPDATE, SHARED_MODULE_UPDATE
        const result = await chrome.storage.local.get("isExtensionOn");
    }
});

// rerun content script when wpm/isExtensionOn value is changed through action popup
chrome.storage.onChanged.addListener(async (changes, areaName) => {
    if (areaName == "local" && changes.wpm) {
        // console.log(`old wpm: ${changes.wpm?.oldValue}, new wpm: ${changes.wpm?.newValue}`);
        // rerunning in the same context with reExecuteContentScript() is causing variable scoping issues
        // just reload tabs for now as that will rerun the content script in a new context
        await refreshWikiTabs();
    }

    if (areaName == "local" && changes.isExtensionOn) {
        await refreshWikiTabs();
    }
});
