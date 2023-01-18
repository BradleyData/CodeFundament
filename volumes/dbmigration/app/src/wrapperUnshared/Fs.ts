import { execSync } from "child_process"
import { Fs as Fs2 } from "../wrapper/Fs"

export class Fs {
    static compare({file1, file2}: {file1: string, file2: string}): boolean {
        if (!Fs2.fileExistsSync({file: file1}))
            return false
        if (!Fs2.fileExistsSync({file: file2}))
            return false

        try {
            execSync(`cmp ${file1} ${file2}`)
        } catch (err) {
            return false
        }
        return true
    }

    static touch({file}: {file: string}): void {
        if (Fs2.fileExistsSync({file}))
            return
        if (file.includes(";") || file.includes("(") || file.includes("&") || file.includes("|"))
            return

        execSync(`touch ${file}`)
    }
}