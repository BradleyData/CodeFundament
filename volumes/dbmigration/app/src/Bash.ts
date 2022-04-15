import { execSync } from "child_process"

export class Bash {
    static getBranchName(): string {
        return execSync("cat /home/node/.HEAD | cut -d / -f 3-").toString()
    }
}
