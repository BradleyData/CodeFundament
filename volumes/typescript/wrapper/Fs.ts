import { readFileSync as fsReadFileSync } from "fs"

export class Fs {
    static readFileSync({ file }: { file: string }): string {
        return fsReadFileSync(file, "utf-8")
    }
}
