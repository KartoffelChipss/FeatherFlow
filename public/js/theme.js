const root = document.querySelector(":root");
const themeLink = document.getElementById("theme-link");

function setProperty(name, value) {
    console.log("Setting property: ", name, " to ", value);
    root.style.setProperty(name, value);
}

function updateTheme(theme) {
    console.log("Setting theme: ", theme);
    themeLink.setAttribute("href", `css/themes/${theme}.css`);
}

window.api.invoke("getTheme").then((theme) => updateTheme(theme));

window.bridge.setTheme((e, theme) => updateTheme(theme));