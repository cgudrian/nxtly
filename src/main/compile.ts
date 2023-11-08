import { withTempDir } from './temp';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as child_process from 'node:child_process';
import * as util from 'node:util';

const execFile = util.promisify(child_process.execFile);

export async function compileFile(source: string): Promise<boolean> {
    return await withTempDir(async (dir): Promise<boolean> => {
        const sourceFile = path.join(dir, "program.nxc");
        const rxeFile = path.join(dir, "program.rxe");
        await fs.writeFile(sourceFile, source);
        console.log("Wrote " + sourceFile);

        try {
            await execFile("/Users/christian/src/BricxCommandCenter/NXT/nbc",
                ["-T=NXT", "-EF", "-O=" + rxeFile, "-Z6", sourceFile]
            );
        } catch (e) {
            console.error(e);
            return false;
        }

        return true;
    });
}
