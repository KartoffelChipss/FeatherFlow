function setSetting(setting, value, fun) {
    let newValue = fun ? fun(value) : value;
    console.log(`Set ${setting} to`, newValue);

    window.api.invoke("setSetting", { setting, value: newValue});
}

function updateSettings() {
    window.api.invoke("getEditorSettings").then((settings) => {
        for (const setting in settings) {
            // console.log(`Setting ${setting} to`, settings[setting]);
            setInputValue(document.getElementById(`settings-${setting}`), settings[setting]);
        }
    });
}

updateSettings();

function setInputValue(element, value) {
    if (!element) {
        console.log("Element not found");
        return;
    }

    if (typeof value === "number") value = value.toString();

    switch (element.type) {
        case "checkbox":
            setCheckboxValue(element, value);
            break;
        case "number":
            setNumberValue(element, value);
            break;
        case "select-one":
            setSelectValue(element, value);
            break;
        default:
            element.value = value;
            break;
    }
}

function setCheckboxValue(element, value) {
    element.checked = value;
}

function setSelectValue(element, value) {
    for (let i = 0; i < element.options.length; i++) {
        if (element.options[i].value === value) {
            element.selectedIndex = i;
            break;
        }
    }
}