const root = document.querySelector(":root");
const colorSchemeLink = document.getElementById("colorscheme-link");
const themeLink = document.getElementById("theme-link");

function setProperty(name, value) {
    console.log("Setting property: ", name, " to ", value);
    root.style.setProperty(name, value);
}

function getProperty(name) {
    return getComputedStyle(root).getPropertyValue(name);
}

function updateColorScheme(colorScheme) {
    console.log("Setting colorScheme: ", colorScheme);
    colorSchemeLink.setAttribute("href", `css/colorSchemes/${colorScheme}.css`);
}

window.api.invoke("getColorScheme").then((theme) => updateColorScheme(theme));

window.bridge.setColorScheme((e, theme) => updateColorScheme(theme));

function updateTheme(theme) {
    console.log("Setting theme: ", theme);
    themeLink.setAttribute("href", `css/themes/${theme}.css`);
}

window.api.invoke("getTheme").then((theme) => updateTheme(theme));

window.bridge.setTheme((e, theme) => updateTheme(theme));