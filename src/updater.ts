import {autoUpdater, AppUpdater} from "electron-updater";
import logger from "electron-log";
import {app, shell} from "electron";
import updatePrompt from "./dialog/updatePrompt";
import {getStore} from "./store";
import updateDownloaded from "./dialog/updateDownloaded";

autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = false;

export function checkForUpdates(): void {
    autoUpdater.checkForUpdates();
}

autoUpdater.on("update-available", async () => {
    logger.info("Update available! Current version: " + app.getVersion());

    const promptResult = await updatePrompt();

    if (promptResult === "update") {
        // If on macos, open link to github releases
        if (process.platform === "darwin") shell.openExternal("https://github.com/KartoffelChipss/FeatherFlow/releases");
        // Otherwise, download the update
        else autoUpdater.downloadUpdate();
    } else if (promptResult === "remindlater") {
        getStore().set("lastUpdateReminder", Date.now());
        logger.info("User chose to be reminded later.");
    }
});

autoUpdater.on("update-not-available", () => {
    logger.info("No update available. Current version: " + app.getVersion());
});

autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    logger.info(log_message);
});

autoUpdater.on("update-downloaded", async () => {
    logger.info("Update downloaded! Current version: " + app.getVersion());

    const restartNow = await updateDownloaded();

    if (restartNow === "installAndRestart") {
        autoUpdater.quitAndInstall();
    } else {
        logger.info("User chose to install later.");
        autoUpdater.autoInstallOnAppQuit = true;
    }
});

autoUpdater.on("error", (error) => {
    logger.error("Error checking for updates:", error);
});