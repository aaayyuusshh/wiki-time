const radios = document.getElementsByName("group-one");
chrome.storage.local.get("wpm").then(result => {
    console.log(result.wpm);
    radios.forEach(radio => {
        if(radio.value == result.wpm) {
           radio.checked = true;
           console.log(radio.value)
        }

        radio.addEventListener("change", event => {
            console.log(`${event.target.value}`);
            chrome.storage.local.set({wpm: event.target.value});
        });
    });
});