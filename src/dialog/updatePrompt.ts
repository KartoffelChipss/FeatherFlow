import { dialog } from 'electron'

export default async function (): Promise<
    'update' | 'remindlater' | 'discard'
> {
    const result = await dialog.showMessageBox({
        type: 'info',
        buttons: ['Update', 'Remind Later', 'Discard'],
        defaultId: 0,
        title: 'Update Available',
        message:
            'A new version of FeatherFlow is available. Would you like to update now?',
    })

    if (result.response == 0) return 'update'
    else if (result.response == 1) return 'remindlater'
    else return 'discard'
}
