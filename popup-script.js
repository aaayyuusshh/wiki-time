const radios = document.getElementsByName("group-one");
const customRadio = document.getElementById("cust");
const customTextbox = document.getElementById("custom-textbox")
const customSetBtn = document.querySelector(".custom-set-btn");
const toggleBtn = document.querySelector(".toggle-btn");
const popupContainer = document.querySelector(".popup-container");
const customContainer = document.querySelector(".custom-container");

function saveWpm(wpm) {
    chrome.storage.local.set({wpm: wpm});
}

function showCustomWpmControls() {
    customTextbox.style.display = "block";
    customSetBtn.style.display = "block"; 
}

function hideCustomWpmControls() {
    customTextbox.style.display = "none";
    customSetBtn.style.display = "none"; 
}

function handleRadioChange(event) {
    let radio = event.target;
    customTextbox.value = '';
    customSetBtn.disabled = true;
    if(radio.value == "custom") {
        showCustomWpmControls(); 
    } else {
        hideCustomWpmControls();
        saveWpm(radio.value);
    }
}

function setCustomWpmState(storedWpm) {
    customRadio.checked = true;
    showCustomWpmControls();
    customTextbox.value = storedWpm;
    customSetBtn.disabled = true;
}

function initializeRadios(storedWpm) {
    let matched = false;
    radios.forEach(radio => {
        if(radio.value == storedWpm) {
           radio.checked = true;
           matched = true;
        } 
        radio.addEventListener("change", handleRadioChange)
    });

    if(!matched && storedWpm) {
        setCustomWpmState(storedWpm);
    }
}

function initializeCustomWpmSection() {
    customSetBtn.addEventListener("click", () => {
        let customWPM = customTextbox.value;
        if(customWPM) {
            saveWpm(customWPM);
            customSetBtn.disabled = true;
        }
    });

    customTextbox.addEventListener("input", () => {
        if(customTextbox.value == '') {
            customSetBtn.disabled = true;
        } else {
            customSetBtn.disabled = false;
        }
    });
}

function initializeToggle() {
    toggleBtn.addEventListener("click", async () => {
        let result = await chrome.storage.local.get("isExtensionOn");
        let isExtensionOn = result.isExtensionOn;
        setPopupState(!isExtensionOn);
        await chrome.storage.local.set({isExtensionOn: !isExtensionOn});
    });
}

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

chrome.storage.local.get(["wpm", "isExtensionOn"]).then(result => {
    setPopupState(result.isExtensionOn);
    initializeRadios(result.wpm);
    initializeCustomWpmSection();
    initializeToggle();
});