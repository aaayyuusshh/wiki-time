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
                && childNode.firstChild.getAttribute("id") === "References") {
                    console.log("--reached references--");
                    break;
            }
            if(nodeHtmlTag != "style" && nodeHtmlTag != "script" && nodeHtmlTag != "img") {
                text += parseText(childNode);
            }
        }
    }
    return text;
}

console.log("script is running...");
const bodyContent = document.querySelector(".mw-content-ltr");
console.log(parseText(bodyContent));