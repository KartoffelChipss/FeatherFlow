import { dialog } from 'electron';

export default async function showUnsavedChangesDialog(): Promise<
    'save' | 'discard' | 'cancel'
> {
    const result = await dialog.showMessageBox({
        type: 'warning',
        buttons: ['Save', 'Discard', 'Cancel'],
        defaultId: 0,
        title: 'Unsaved changes',
        message: 'You have unsaved changes. Do you want to save them?',
    });

    if (result.response == 0) return 'save';
    else if (result.response == 1) return 'discard';
    else return 'cancel';
}
