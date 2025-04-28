import { MenuItemConstructorOptions } from 'electron'

export default function (): MenuItemConstructorOptions {
    return { role: 'window' }
}
