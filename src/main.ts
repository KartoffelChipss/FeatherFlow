import {app, BrowserWindow, nativeImage, protocol} from "electron";
import logger from "electron-log/main";
import {closeWindow, createWindow, getAllWindows, openMainWindow} from "./windowManager";
import showOpenFileDialog from "./dialog/openFile";
import {updateMenu} from "./menus/appMenu";
import {addRecentFile, getStore} from "./store";
import path from "path";
import fs from "fs";
import {updateColorScheme} from "./theme";
import "./ipcHandler";
import "dotenv/config";
import {startCheckingForUpdates} from "./updater";
import { logPath } from "./locations";

export * from "./locations";

export const devMode = process.env.NODE_ENV === "development";

logger.transports.file.resolvePathFn = () => logPath;
logger.transports.file.level = "info";
Object.assign(console, logger.functions);

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

    startCheckingForUpdates();

    let openedInitialFile = false;
    initialFile = getInitialFile();
    
    logger.info("Arguments:", process.argv);

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
    if (process.platform !== "darwin") app.quit();
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

function getInitialFile(): string | null {
    let initialFile: string | null = null;

    if (devMode && process.argv.length >= 3) initialFile = process.argv[2];
    if (!devMode && process.argv.length >= 2) initialFile = process.argv[1];

    if (initialFile) {
        // Check if file exists
        if (!fs.existsSync(initialFile)) {
            logger.error("Initial file does not exist:", initialFile);
            return null;
        }

        // Check if is directory
        if (fs.lstatSync(initialFile).isDirectory()) {
            logger.error("Initial file is a directory:", initialFile);
            return null;
        }
    }

    return initialFile;
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
