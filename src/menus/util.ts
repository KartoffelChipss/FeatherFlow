import path from 'path'
import { nativeImage, NativeImage } from 'electron'

export function iconPath(name: string): string {
    return path.resolve(path.join(__dirname + `/../../public/img/${name}.png`))
}

export function iconNativeImage(name: string): NativeImage {
    return nativeImage
        .createFromPath(iconPath(name))
        .resize({ width: 16, height: 16 })
}

export const isMac = process.platform === 'darwin'
