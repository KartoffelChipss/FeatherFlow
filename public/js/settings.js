const selectSeperator = document.createElement('option')
selectSeperator.text = '──────────'
selectSeperator.disabled = true

function setSetting(setting, value, fun) {
    let newValue = fun ? fun(value) : value
    console.log(`Set ${setting} to`, newValue)

    window.api.invoke('setSetting', { setting, value: newValue })
}

function updateSettings() {
    const getThemes = window.api
        .invoke('getThemeList')
        .then(({ defaultThemes, customThemes }) => {
            document.getElementById('settings-theme').innerHTML = ''

            for (const theme of defaultThemes) {
                let option = document.createElement('option')
                option.text = theme.themeName
                option.value = theme.path
                document.getElementById('settings-theme').add(option)
            }

            if (customThemes.length > 0)
                document.getElementById('settings-theme').add(selectSeperator)

            for (const theme of customThemes) {
                let option = document.createElement('option')
                option.text = theme.themeName
                option.value = theme.path
                document.getElementById('settings-theme').add(option)
            }
        })

    const getBGImages = window.api
        .invoke('getBackgroundImages')
        .then((images) => {
            document.getElementById('settings-bgimage').innerHTML =
                "<option value=''>None</option>"
            for (const image of images) {
                let option = document.createElement('option')
                option.text = image.fileName
                option.value = image.path
                document.getElementById('settings-bgimage').add(option)
            }
        })

    Promise.all([getThemes, getBGImages]).then(() => {
        window.api.invoke('getEditorSettings').then((settings) => {
            for (const setting in settings) {
                // console.log(`Setting ${setting} to`, settings[setting]);
                setInputValue(
                    document.getElementById(`settings-${setting}`),
                    settings[setting]
                )
            }
        })
    })
}

updateSettings()

function setInputValue(element, value) {
    if (!element) {
        console.log('Element not found')
        return
    }

    if (typeof value === 'number') value = value.toString()

    switch (element.type) {
        case 'checkbox':
            setCheckboxValue(element, value)
            break
        case 'number':
            setNumberValue(element, value)
            break
        case 'select-one':
            setSelectValue(element, value)
            break
        default:
            element.value = value
            break
    }
}

function setCheckboxValue(element, value) {
    element.checked = value
}

function setSelectValue(element, value) {
    for (let i = 0; i < element.options.length; i++) {
        if (element.options[i].value === value) {
            element.selectedIndex = i
            break
        }
    }
}

window.bridge.updateSettings(() => updateSettings())
