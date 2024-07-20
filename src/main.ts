import {app, BrowserWindow, nativeTheme, nativeImage, protocol} from "electron";
import logger from "electron-log/main";
import {closeWindow, createWindow, getAllWindows,openMainWindow} from "./windowManager";
import fs from "fs";
import showOpenFileDialog from "./dialog/openFile";
import {updateMenu} from "./menus/appMenu";
import {addRecentFile, getStore} from "./store";
import path from "path";
import "dotenv/config";
import {updateColorScheme} from "./theme";
import "./ipcHandler";
import {checkForUpdates} from "./updater";
import {exec} from "child_process";

export const devMode = process.env.NODE_ENV === "development";

logger.transports.file.resolvePathFn = () => path.join(appRoot, "logs.log");
logger.transports.file.level = "info";

export const appRoot: string = path.join(`${app.getPath("appData") ?? "."}${path.sep}.featherFlow`,);
if (!fs.existsSync(appRoot)) fs.mkdirSync(appRoot, {recursive: true});

const iconPath = path.resolve(path.join(__dirname + "/../public/img/logo.png"));

let fileDialogOpen = false;
let initialFile: string | null = null;

protocol.registerSchemesAsPrivileged([{
    scheme: "featherflow",
    privileges: {standard: true, secure: true, supportFetchAPI: true},
}]);

app.on("ready", () => {
    logger.log(" ");
    logger.log("====== ======");
    logger.log("App Started!");
    if (devMode) logger.log("Running in development mode");
    logger.log("====== ======\n");

    const lastUpdateReminder = getStore().get("lastUpdateReminder") as number;

    if (lastUpdateReminder) {
        const timeSinceLastUpdate = Date.now() - lastUpdateReminder;
        const daysSinceLastUpdate = timeSinceLastUpdate / (1000 * 60 * 60 * 24);

        if (daysSinceLastUpdate > 1) checkForUpdates();
    } else checkForUpdates();

    let openedInitialFile = false;
    if (devMode && process.argv.length >= 3) initialFile = process.argv[2];
    if (!devMode && process.argv.length >= 2) initialFile = process.argv[1];

    logger.info("Arguments:", process.argv);

    logger.info("Starting FeatherFlow with initial file:", initialFile);

    if (process.platform === "darwin") app.dock.setIcon(nativeImage.createFromPath(iconPath));

    updateColorScheme();

    app.setAboutPanelOptions({
        applicationName: "FeatherFlow",
        applicationVersion: app.getVersion(),
        version: "",
        authors: ["Jan Straßburger (Kartoffelchipss)"],
        website: "https://strassburger.org/",
        copyright: "© 2024 Jan Straßburger",
        iconPath: iconPath,
    });

    if (initialFile) {
        logger.info("Opening initial file:", initialFile);
        createWindow(initialFile);
        addRecentFile(initialFile);
        openedInitialFile = true;
    }

    app.on("activate", () => {
        // Only open the if there are no windows open and there is no initial file or the initial file was already opened
        if (BrowserWindow.getAllWindows().length === 0 && (!initialFile || openedInitialFile)) activateAction();
    });

    updateMenu();

    if (!initialFile) activateAction();
});

app.on("open-file", (event, filePath) => {
    logger.info("Opening file from event:", filePath);

    event.preventDefault();

    if (app.isReady()) {
        createWindow(filePath);
        addRecentFile(filePath);
    } else {
        initialFile = filePath;
    }
});

app.on("before-quit", (event) => {
    for (const window of getAllWindows()) {
        if (window) closeWindow(window);
    }
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("browser-window-focus", updateMenu);
app.on("browser-window-blur", updateMenu);

function activateAction() {
    switch (getStore().get("activateAction")) {
        case "mainWindow":
            openMainWindow();
            break;
        case "newFile":
            createWindow();
            break;
        case "open":
            openFile();
            break;
        default:
            break
    }
}

export async function openFile() {
    if (fileDialogOpen) return;
    fileDialogOpen = true;

    const filePath = await showOpenFileDialog();

    fileDialogOpen = false;

    if (!filePath) return;

    createWindow(filePath);
    addRecentFile(filePath);
}