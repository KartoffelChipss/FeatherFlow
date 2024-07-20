import {app, dialog} from "electron";

export default async function (): Promise<boolean> {
    const result = await dialog.showMessageBox({
        type: 'info',
        buttons: ['OK'],
        defaultId: 0,
        title: 'No Update Available',
        message: 'No update available!\nCurrent version: ' + app.getVersion(),
    });

    return true;
}