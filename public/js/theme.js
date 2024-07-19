const root = document.querySelector(":root");
const themeLink = document.getElementById("theme-link");

function setProperty(name, value) {
    console.log("Setting property: ", name, " to ", value);
    root.style.setProperty(name, value);
}

function updateColorScheme(theme) {
    console.log("Setting theme: ", theme);
    themeLink.setAttribute("href", `css/colorSchemes/${theme}.css`);
}

window.api.invoke("getColorScheme").then((theme) => updateColorScheme(theme));

window.bridge.setColorScheme((e, theme) => updateColorScheme(theme));