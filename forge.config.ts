import type { ForgeConfig } from '@electron-forge/shared-types'
import { MakerSquirrel } from '@electron-forge/maker-squirrel'
import { MakerZIP } from '@electron-forge/maker-zip'
import { MakerDeb } from '@electron-forge/maker-deb'
import { MakerRpm } from '@electron-forge/maker-rpm'
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives'
import { WebpackPlugin } from '@electron-forge/plugin-webpack'
import * as fs from 'fs'
import * as path from 'path'
import { spawn } from 'child_process'

import { mainConfig } from './webpack.main.config'
import { rendererConfig } from './webpack.renderer.config'

const config: ForgeConfig = {
    packagerConfig: {
        asar: true,
    },
    rebuildConfig: {},
    makers: [new MakerSquirrel({}), new MakerZIP({}, ['darwin']), new MakerRpm({}), new MakerDeb({})],
    plugins: [
        new AutoUnpackNativesPlugin({}),
        new WebpackPlugin({
            mainConfig,
            renderer: {
                config: rendererConfig,
                entryPoints: [
                    {
                        html: './src/index.html',
                        js: './src/renderer.ts',
                        name: 'main_window',
                        preload: {
                            js: './src/preload.ts',
                        },
                    },
                ],
            },
        }),
    ],
    hooks: {
        packageAfterPrune: async (_, buildPath, __, platform) => {
            const commands = [
                "install",
                "--no-package-lock",
                "--no-save",
                "usb"
            ]

            return new Promise((resolve, reject) => {
                const oldPkgJson = path.join(buildPath, "package.json")
                const newPkgJson = path.join(buildPath, "_package.json")

                fs.renameSync(oldPkgJson, newPkgJson)

                const npmInstall = spawn('npm', commands, {
                    cwd: buildPath,
                    stdio: 'inherit',
                    shell: true
                })

                npmInstall.on('close', code => {
                    if (code === 0) {
                        fs.renameSync(newPkgJson, oldPkgJson)

                        if (platform === "win32") {
                            const problematicPaths = [
                                "android-arm",
                                "android-arm64",
                                "darwin-x64+arm64",
                                "linux-arm",
                                "linux-arm64",
                                "linux-x64",
                            ]
                            problematicPaths.forEach(folder => {
                                fs.rmSync(path.join(buildPath, "node_modules", "usb", "prebuilds", folder), { recursive: true, force: true })
                            })
                        }
                        resolve()
                    } else {
                        reject(new Error('process finished with error code ' + code))
                    }
                })

                npmInstall.on('error', reject)
            })
        }
    },
}

export default config
