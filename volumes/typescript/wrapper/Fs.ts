import {
    accessSync,
    constants,
    readdirSync as fsReadDirSync,
    readFileSync as fsReadFileSync,
} from "fs"

export class Fs {
    static fileExistsSync({ file }: { file: string }): boolean {
        try {
            accessSync(file, constants.F_OK)
        } catch (err) {
            return false
        }
        return true
    }

    static readFileSync({ file }: { file: string }): string {
        return fsReadFileSync(file, "utf-8")
    }

    static readDirSync({ path }: { path: string }): string[] {
        return fsReadDirSync(path)
    }
}
