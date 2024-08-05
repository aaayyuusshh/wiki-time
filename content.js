function parseText(node) {
    let text = "";
    if(node.nodeType === Node.TEXT_NODE) {
        text += node.textContent;    
    } else if(node.nodeType === Node.ELEMENT_NODE) {
        for(let childNode of node.childNodes) {
            let nodeHtmlTag = node.nodeName.toLowerCase();
            let nodeDisplayStyle = window.getComputedStyle(node).getPropertyValue("display");
            if(childNode.nodeType === Node.ELEMENT_NODE 
                && childNode.className.includes("mw-heading") 
                && childNode.firstChild.nodeType == Node.ELEMENT_NODE 
                && (childNode.firstChild.getAttribute("id") === "References" || childNode.firstChild.getAttribute("id") === "Citations" )) {
                    console.log("--reached references/citations--");
                    break;
            }
            if(nodeDisplayStyle != "none" && nodeHtmlTag != "style" && nodeHtmlTag != "script" && nodeHtmlTag != "img") {
                text += (" " + parseText(childNode));
                // everytime parseText is called recursively, an extra space is added to the beginning of the output of that recursive call
                // this helps with cases where multiple words are parsed without spaces(in tables so far), i.e., "LocationGreater Manchester"
            }
        }
    }
    return text;
}

function printChildNodes(node) {
    console.log(node.childNodes);
}

function splitArticleText(articleText, delimeter) {
    return articleText.split(' ');
}

const WORDS_PER_MINUTE = 200;
console.log("script is running...");
const bodyContent = document.querySelector(".mw-content-ltr");
let articleText = parseText(bodyContent);
console.log(articleText);
let articleTextList =  splitArticleText(articleText);
console.log(articleTextList);