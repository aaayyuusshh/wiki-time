const DOMModule = (function () {
    const elements = {
        radios: document.getElementsByName("group-one"),
        customRadio: document.getElementById("cust"),
        customTextbox: document.getElementById("custom-textbox"),
        customSetBtn: document.querySelector(".custom-set-btn"),
        toggleBtn: document.querySelector(".toggle-btn"),
        popupContainer: document.querySelector(".popup-container"),
        customContainer: document.querySelector(".custom-container")
    };
    return {
        elements,
        showCustomWpmControls() {
            elements.customTextbox.style.display = "block";
            elements.customSetBtn.style.display = "block";
        },
        hideCustomWpmControls() {
            elements.customTextbox.style.display = "none";
            elements.customSetBtn.style.display = "none";
        },
        emptyCustomTextboxValue() {
            elements.customTextbox.value = "";
        },
        disableCustomSetBtn() {
            elements.customSetBtn.disabled = true;
        },
        enableCustomSetBtn() {
            elements.customSetBtn.disabled = false;
        },
        getCustomTextboxValue() {
            return elements.customTextbox.value;
        },
        unGrayOutPopup() {
            elements.popupContainer.style.filter = "none";
        },
        grayOutPopup() {
            elements.popupContainer.style.filter = "grayscale(100%)";
        },
        addToggleButtonText(isOn) {
            elements.toggleBtn.textContent = isOn ? "❚❚ disable WikiTime" : "► enable WikiTime";
        },
        toggleAllRadiosDisabledStatus(status) {
            elements.radios.forEach((radio) => (radio.disabled = status));
        },
        toggleCustomTextboxDisabledStatus(status) {
            elements.customTextbox.disabled = status;
        }
    };
})();

const DOMLogic = (function (DOM) {
    function saveWpm(wpm) {
        chrome.storage.local.set({ wpm: wpm });
    }

    function handleRadioChange(event) {
        let radio = event.target;
        DOM.emptyCustomTextboxValue();
        DOM.disableCustomSetBtn();
        if (radio.value == "custom") {
            DOM.showCustomWpmControls();
        } else {
            DOM.hideCustomWpmControls();
            saveWpm(radio.value);
        }
    }

    // @TODO think about this one
    function setCustomWpmState(storedWpm) {
        DOM.elements.customRadio.checked = true;
        DOM.showCustomWpmControls();
        DOM.elements.customTextbox.value = storedWpm;
        DOM.elements.customSetBtn.disabled = true;
    }

    function initializeRadios(storedWpm) {
        let matched = false;
        DOM.elements.radios.forEach((radio) => {
            if (radio.value == storedWpm) {
                radio.checked = true;
                matched = true;
            }
            radio.addEventListener("change", handleRadioChange);
        });

        if (!matched && storedWpm) {
            setCustomWpmState(storedWpm);
        }
    }

    function initializeCustomWpmSection() {
        DOM.elements.customSetBtn.addEventListener("click", () => {
            let customWPM = DOM.getCustomTextboxValue();
            if (customWPM) {
                saveWpm(customWPM);
                DOM.disableCustomSetBtn();
            }
        });

        DOM.elements.customTextbox.addEventListener("input", () => {
            if (DOM.getCustomTextboxValue()) {
                DOM.enableCustomSetBtn();
            } else {
                DOM.disableCustomSetBtn();
            }
        });
    }

    function initializeToggle() {
        DOM.elements.toggleBtn.addEventListener("click", async () => {
            let result = await chrome.storage.local.get("isExtensionOn");
            let isExtensionOn = result.isExtensionOn;
            setPopupState(!isExtensionOn);
            await chrome.storage.local.set({ isExtensionOn: !isExtensionOn });
        });
    }

    function setPopupState(isExtensionOn) {
        if (isExtensionOn) {
            DOM.unGrayOutPopup();
            DOM.addToggleButtonText(isExtensionOn);
        } else {
            DOM.grayOutPopup();
            DOM.addToggleButtonText(isExtensionOn);
        }
        togglePopupControls(!isExtensionOn);
    }

    function togglePopupControls(bool) {
        DOM.toggleAllRadiosDisabledStatus(bool);
        DOM.toggleCustomTextboxDisabledStatus(bool);
        DOM.disableCustomSetBtn();
    }

    function run() {
        chrome.storage.local.get(["wpm", "isExtensionOn"]).then((result) => {
            setPopupState(result.isExtensionOn);
            initializeRadios(result.wpm);
            initializeCustomWpmSection();
            initializeToggle();
        });
    }

    return { run };
})(DOMModule);

DOMLogic.run();
