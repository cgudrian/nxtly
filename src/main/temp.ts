import { promises as fs } from 'fs'
import * as os from 'os'
import * as path from 'path'

export async function withTempDir(callback: (dir: string) => any, debug = false) {
    const dir = await fs.mkdtemp(await fs.realpath(os.tmpdir()) + path.sep)
    try {
        return await callback(dir)
    } finally {
        if (!debug)
            fs.rm(dir, { recursive: true, force: true })
    }
}
