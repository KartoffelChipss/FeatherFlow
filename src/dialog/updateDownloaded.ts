import { dialog } from 'electron'

export default async function (): Promise<'installAndRestart' | 'later'> {
    // Dialog if update should be installed and app restarted
    const result = await dialog.showMessageBox({
        type: 'info',
        buttons: ['Install and Restart', 'Later'],
        defaultId: 0,
        title: 'Update downloaded',
        message:
            'A new version of FeatherFlow has been downloaded. Install and restart now?',
    })

    if (result.response == 0) return 'installAndRestart'
    else return 'later'
}
