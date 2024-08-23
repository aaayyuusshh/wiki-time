const radios = document.getElementsByName("group-one");
const customRadio = document.getElementById("cust");
const customTextbox = document.getElementById("custom-textbox")
const customSetBtn = document.querySelector(".custom-set-btn");

chrome.storage.local.get("wpm").then(result => {
    console.log(result.wpm);
    let storedWpm = result.wpm;
    let matched = false;
    radios.forEach(radio => {
        if(radio.value == storedWpm) {
           radio.checked = true;
           matched = true;
           console.log(radio.value)
        } 

        radio.addEventListener("change", () => {
            if(radio.value == "custom") {
                customTextbox.style.display = "block";
                customSetBtn.style.display = "block";   
            } else {
                customTextbox.style.display = "none";
                customSetBtn.style.display = "none";
                console.log(`${radio.value}`);
                chrome.storage.local.set({wpm: radio.value});
            }
        });
    });

    if(!matched && storedWpm) {
        customRadio.checked = true;
        customTextbox.style.display = "block";
        customSetBtn.style.display = "block";
        customTextbox.value = storedWpm;
    }

    customSetBtn.addEventListener("click", () => {
        let customWPM = customTextbox.value;
        if(customWPM) {
            chrome.storage.local.set({wpm: customWPM});
        }
    })
});