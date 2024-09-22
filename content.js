const ParserModule = (function() {
    function isReferencesSection(node) {
        return (node.nodeType === Node.ELEMENT_NODE 
            && node.className.includes("mw-heading") 
            && node.firstChild.nodeType == Node.ELEMENT_NODE 
            && (node.firstChild.getAttribute("id") === "References" || node.firstChild.getAttribute("id") === "Citations" ))
    }

    function isExplorableNode(node) {
        const nodeHtmlTag = node.nodeName.toLowerCase();
        const nodeDisplayStyle = window.getComputedStyle(node).getPropertyValue("display");
        return nodeDisplayStyle != "none" && !["style", "script", "img"].includes(nodeHtmlTag);
    }

    function printChildNodes(node) {
        console.log(node.childNodes);
    }

   function parseText(node) {
        let text = "";
        if(node.nodeType === Node.TEXT_NODE) {
            text += node.textContent;    
        } 
        else if(node.nodeType === Node.ELEMENT_NODE) {
            for(let childNode of node.childNodes) {
                if(isReferencesSection(childNode)) {
                        console.log("--reached references/citations--");
                        break;
                }
                if(isExplorableNode(node)) {
                    text += (" " + parseText(childNode));
                    // everytime parseText is called recursively, an extra space is added to the beginning of the output of that recursive call
                    // this helps with cases where multiple words are parsed without spaces(in tables so far), i.e., "LocationGreater Manchester"
                }
            }
        }
        return text;
    }

    return {
        parseText
    }
})();


const Utils = (function() {
    /**
     * in: "This   is a   sentence with   irregular   spacing."
     * out: ["This", "is", "a", "sentence", "with", "irregular", "spacing."].
     * treats multiple consecutive spaces, tabs, or new lines as a single separator
     * */ 
    function splitArticleText(articleText) {
        return articleText.split(/\s+/);
    }
    
    function filterEmptyStrings(articleTextList) {
        return articleTextList.filter(elem => elem.length > 0);
    }

    function getArticleTextList(articleText) {
        return filterEmptyStrings(splitArticleText(articleText));
    }

    return {
        getArticleTextList
    }
})();


const TimeCalculatorModule = (function() {
    async function getReadingTime() {
        const result = await chrome.storage.local.get("wpm");
        return result.wpm;
    }

    async function calculateReadingTime(list) {
        const wordsPerMinute = await getReadingTime();
        console.log(`wpm from storage: ${wordsPerMinute}`);
        return Math.ceil(list.length / wordsPerMinute);
    }
    
    return {
        calculateReadingTime
    }
})();


const UIModule = (function() {
    function displayReadingTime(time) {
        const title = document.getElementById("firstHeading");
        console.log(title);
        const readingTime = document.createElement("p");
        readingTime.textContent = `${time} min read`;
        readingTime.id = "readingTimeDisplay";
        title.appendChild(readingTime);
    }

    return {
        displayReadingTime
    }
})();

const MainModule = (function(ParserModule, Utils, TimeCalculatorModule, UIModule) {
    async function run() {
        const isExtensionOn = (await chrome.storage.local.get("isExtensionOn")).isExtensionOn;
        if(isExtensionOn) {
            console.log("script is running...");
            const bodyContent = document.querySelector(".mw-content-ltr");
            const articleText = ParserModule.parseText(bodyContent);
            console.log(articleText);
            const articleTextList = Utils.getArticleTextList(articleText); 
            console.log(articleTextList);
            const readingTime = await TimeCalculatorModule.calculateReadingTime(articleTextList);
            console.log(`estimated reading time: ${readingTime} mins`);
            UIModule.displayReadingTime(readingTime);
        }
    }

    return {
        run
    }
})(ParserModule, Utils, TimeCalculatorModule, UIModule);

// entry point
MainModule.run();
