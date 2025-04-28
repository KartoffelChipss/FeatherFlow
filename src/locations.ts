import path from 'path'
import { app } from 'electron'
import fs from 'fs'
import { getStore } from './store'

export const appRoot: string = path.join(
    `${app.getPath('appData') ?? '.'}${path.sep}.featherFlow`
)
if (!fs.existsSync(appRoot)) fs.mkdirSync(appRoot, { recursive: true })
export const logPath = path.join(appRoot, 'log.log')
export const storePath = getStore().path
export const themesPath = path.join(appRoot, 'themes')
if (!fs.existsSync(themesPath)) fs.mkdirSync(themesPath, { recursive: true })
export const backgroundImagesPath = path.join(appRoot, 'backgroundImages')
if (!fs.existsSync(backgroundImagesPath))
    fs.mkdirSync(backgroundImagesPath, { recursive: true })
