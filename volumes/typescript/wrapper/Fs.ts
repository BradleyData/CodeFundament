import {
    readdirSync as fsReadDirSync,
    readFileSync as fsReadFileSync,
} from "fs"

export class Fs {
    static readFileSync({ file }: { file: string }): string {
        return fsReadFileSync(file, "utf-8")
    }

    static readDirSync({ path }: { path: string }): string[] {
        return fsReadDirSync(path)
    }
}
