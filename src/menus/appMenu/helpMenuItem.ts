import { MenuItemConstructorOptions, shell } from 'electron'

export default function (): MenuItemConstructorOptions {
    return {
        label: 'Help',
        role: 'help',
        submenu: [
            {
                label: 'GitHub Repository',
                click: async () => {
                    await shell.openExternal(
                        'https://github.com/Kartoffelchipss/FeatherFlow'
                    )
                },
            },
            {
                label: 'Report Issue',
                click: async () => {
                    await shell.openExternal(
                        'https://github.com/Kartoffelchipss/FeatherFlow/issues'
                    )
                },
            },
            {
                label: 'Support Discord',
                click: async () => {
                    await shell.openExternal('https://strassburger.org/discord')
                },
            },
        ],
    }
}
