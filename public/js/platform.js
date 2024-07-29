window.api.invoke("getPlatform").then(platform => {
    console.log(platform)
    if (platform === "darwin") return;

    document.querySelector("header").classList.add("notMac");
})