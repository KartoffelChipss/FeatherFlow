import { autoUpdater, AppUpdater } from 'electron-updater'
import logger from 'electron-log'
import { app, shell } from 'electron'
import updatePrompt from './dialog/updatePrompt'
import { getStore } from './store'
import updateDownloaded from './dialog/updateDownloaded'
import noUpdate from './dialog/noUpdate'

autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = false
autoUpdater.logger = logger

let manualCheck = false

export function startCheckingForUpdates(): void {
    const lastUpdateReminder = getStore().get('lastUpdateReminder') as number

    if (lastUpdateReminder) {
        const timeSinceLastUpdate = Date.now() - lastUpdateReminder
        const daysSinceLastUpdate = timeSinceLastUpdate / (1000 * 60 * 60 * 24)

        if (daysSinceLastUpdate < 1) {
            logger.info(
                'Last update reminder was less than a day ago. Skipping update check.'
            )
            return
        }

        if (!getStore().get('checkForUpdates')) {
            logger.info('Update checks are disabled. Skipping update check.')
            return
        }

        checkForUpdates()
    } else if (getStore().get('checkForUpdates')) checkForUpdates()
}

export function checkForUpdates(manual: boolean = false): void {
    manualCheck = manual
    autoUpdater.checkForUpdates()
}

autoUpdater.on('update-available', async () => {
    logger.info('Update available! Current version: ' + app.getVersion())

    const promptResult = await updatePrompt()
    manualCheck = false

    if (promptResult === 'update') {
        // If on macos, open link to github releases
        if (process.platform === 'darwin')
            shell.openExternal(
                'https://github.com/KartoffelChipss/FeatherFlow/releases'
            )
        // Otherwise, download the update
        else autoUpdater.downloadUpdate()
    } else if (promptResult === 'remindlater') {
        getStore().set('lastUpdateReminder', Date.now())
        logger.info('User chose to be reminded later.')
    }
})

autoUpdater.on('update-not-available', () => {
    logger.info('No update available. Current version: ' + app.getVersion())
    if (manualCheck) {
        getStore().set('lastUpdateReminder', Date.now())
        noUpdate()
        manualCheck = false
    }
})

autoUpdater.on('download-progress', (progressObj) => {
    let log_message = 'Download speed: ' + progressObj.bytesPerSecond
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%'
    log_message =
        log_message +
        ' (' +
        progressObj.transferred +
        '/' +
        progressObj.total +
        ')'
    logger.info(log_message)
})

autoUpdater.on('update-downloaded', async () => {
    logger.info('Update downloaded! Current version: ' + app.getVersion())

    const restartNow = await updateDownloaded()

    if (restartNow === 'installAndRestart') {
        autoUpdater.quitAndInstall()
    } else {
        logger.info('User chose to install later.')
        autoUpdater.autoInstallOnAppQuit = true
    }
})

autoUpdater.on('error', (error) => {
    logger.error('Error checking for updates:', error)
})
