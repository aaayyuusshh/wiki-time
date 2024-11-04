const ParserModule = (function() {
    let imageCount = 0;

    function isReferencesSection(node) {
        return (
            node.nodeType === Node.ELEMENT_NODE 
            && node.className.includes("mw-heading") 
            && node.firstChild.nodeType == Node.ELEMENT_NODE 
            && ["References", "Citations", "Notes", "See_also"].includes(node.firstChild.getAttribute("id"))
        );
    }

    function isDisplayNone(node) {
        const nodeDisplayStyle = window.getComputedStyle(node).getPropertyValue("display");
        return nodeDisplayStyle == "none";
    }
    
    function isInvalidTag(node) {
        const nodeHtmlTag = node.nodeName.toLowerCase();
        return ["style", "script"].includes(nodeHtmlTag);
    }

    function isBracketReferences(node) {
        return node.nodeName.toLowerCase() == "sup" && node.classList.contains("reference");
    }

    function isEditSection(node) {
        return node.classList.contains("mw-editsection");
    }
   
    function isExplorableNode(node) {
        return !isDisplayNone(node)
            && !isInvalidTag(node)
            && !isBracketReferences(node)
            && !isEditSection(node);
    }

    function isImage(node) {
        return node.nodeName.toLowerCase() === "img";
    }
    
    function incrementImageCount() {
        imageCount++;
    }

    function getImageCount() {
        return imageCount;
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
            if(isImage(node) && !isDisplayNone(node)) {
                incrementImageCount();
            }
            // images don't have children so this loop won't run
            for(let childNode of node.childNodes) {
                if(isReferencesSection(childNode)) {
                        // console.log("--reached references/citations--");
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
        parseText, getImageCount
    }
})();


const Utils = (function() {
    /**
     * in: "This   is a   sentence with   irregular   spacing."
     * out: ["This", "is", "a", "sentence", "with", "irregular", "spacing."].
     * treats multiple consecutive spaces, tabs, or new lines as a single separator
     * */ 
    function splitArticleText(articleText) {
        if(articleText.trim() === '')
            return [''];

        return articleText.split(/\s+/);
    }
    
    function filterNonWords(articleTextList) {
        return articleTextList.filter(elem => {
	        return elem.length > 0 && !/^[\p{P}\s]+$/u.test(elem);
        });
   }

    function extractArticleWords(articleText) {
        return filterNonWords(splitArticleText(articleText));
    }

    return {
        extractArticleWords, splitArticleText, filterNonWords
    }
})();


const TimeCalculatorModule = (function() {
    const SECONDS_PER_IMAGE = 5;

    async function getReadingTime() {
        const result = await chrome.storage.local.get("wpm");
        if(!result.wpm) {
            return 300;
        }
        return result.wpm;
    }

    async function calculateTextReadingTime(list) {
        const wordsPerMinute = await getReadingTime();
        return list.length / wordsPerMinute;
    }

    function calculateImageReadingTime(numOfImages) {
        let imagesTimeInSeconds = numOfImages * SECONDS_PER_IMAGE;
        return imagesTimeInSeconds/60;
    }

    async function calculateReadingTime(list, numOfImages) {
        return Math.ceil(await calculateTextReadingTime(list) + calculateImageReadingTime(numOfImages));
    }
    
    return {
        calculateReadingTime, getReadingTime, calculateTextReadingTime, calculateImageReadingTime
    }
})();


const UIModule = (function() {
    function displayReadingTime(time) {
        const title = document.getElementById("firstHeading");
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
    const WIKIPEDIA_BODY = ".mw-content-ltr";

    function LOGGER(...args) {
        for (let arg of args) {
            console.log(arg);
        }
    }

    async function run() {
        const isExtensionOn = (await chrome.storage.local.get("isExtensionOn")).isExtensionOn;
        if(isExtensionOn) {
            console.log("script is running...");
            const bodyContent = document.querySelector(WIKIPEDIA_BODY);
            if (!bodyContent) {
                console.error("error: bodyContent is null");
                return;
            }
            const articleText = ParserModule.parseText(bodyContent);
            // console.log(articleText);
            LOGGER(`image count: ${ParserModule.getImageCount()}`);
            const articleTextList = Utils.extractArticleWords(articleText);
            // console.log(articleTextList);
            const numOfImages = ParserModule.getImageCount();
            LOGGER(articleText, articleTextList);
            const readingTime = await TimeCalculatorModule.calculateReadingTime(articleTextList, numOfImages);
            UIModule.displayReadingTime(readingTime);
        }
    }

    return {
        run, LOGGER
    }
})(ParserModule, Utils, TimeCalculatorModule, UIModule);


// only export modules if we are running in a node.js env(for testing)
if(typeof module !== "undefined" && module.exports) {
    module.exports = {
        Utils, 
        TimeCalculatorModule, 
        UIModule,
        ParserModule, 
        MainModule
    };
} else { // only hit entry point if running in the browser
    if(document.readyState != "complete") {
        console.log("waiting for page to load...")
        window.onload = () => {
            MainModule.run();
        }
    } else {
        MainModule.run();
    }
}
