function parseText(node) {
    let text = "";
    if(node.nodeType === Node.TEXT_NODE) {
        text += node.textContent;    
    } else if(node.nodeType === Node.ELEMENT_NODE) {
        for(let childNode of node.childNodes) {
            let childNodeHtmlTag = childNode.nodeName.toLowerCase();
            if(childNodeHtmlTag != "style" && childNodeHtmlTag != "script" && childNodeHtmlTag != "img") {
                text += parseText(childNode);
            }
        }
    }
    return text;
}

console.log("script is running...");
const bodyContent = document.querySelector(".mw-content-ltr");
console.log(parseText(bodyContent));