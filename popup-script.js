const radios = document.getElementsByName("group-one");
const customRadio = document.getElementById("cust");
const customTextbox = document.getElementById("custom-textbox")
const customSetBtn = document.querySelector(".custom-set-btn");
const toggleBtn = document.querySelector(".toggle-btn");
const popupContainer = document.querySelector(".popup-container");
const customContainer = document.querySelector(".custom-container");

chrome.storage.local.get(["wpm", "isExtensionOn"]).then(result => {
    setPopupState(result.isExtensionOn);

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
            customTextbox.value = '';
            customSetBtn.disabled = true;
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
        customSetBtn.disabled = true;
    }

    customSetBtn.addEventListener("click", () => {
        console.log("here");
        let customWPM = customTextbox.value;
        if(customWPM) {
            // should i handle this with async/await??
            chrome.storage.local.set({wpm: customWPM});
            customSetBtn.disabled = true;
        }
    });

    customTextbox.addEventListener("input", () => {
        if(customTextbox.value == '') {
            customSetBtn.disabled = true;
            console.log("empty");
        } else {
            customSetBtn.disabled = false;
        }
    });

    toggleBtn.addEventListener("click", async () => {
        let result = await chrome.storage.local.get("isExtensionOn");
        let isExtensionOn = result.isExtensionOn;
        setPopupState(!isExtensionOn);
        await chrome.storage.local.set({isExtensionOn: !isExtensionOn});
    });
});


function setPopupState(isExtensionOn) {
    if(isExtensionOn) {
       popupContainer.style.filter = "none";
        toggleBtn.textContent = "❚❚ disable wiki-time";
    } 
    else {
       popupContainer.style.filter = "grayscale(100%)";
        toggleBtn.textContent = "► enable wiki-time";
    }
    disablePopupControls(isExtensionOn);
}

function disablePopupControls(bool) {
    radios.forEach(radio => radio.disabled = !bool);
    customTextbox.disabled = !bool;
    customSetBtn.disabled = true;
}