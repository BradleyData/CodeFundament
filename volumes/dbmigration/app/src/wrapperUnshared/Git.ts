import { execSync } from "child_process"

export class Git {
    private static workTree = "/home/node/gitRepo"
    private static gitDir = `${Git.workTree}/.git`
    private static cmd = `git --work-tree=${Git.workTree} --git-dir=${Git.gitDir}`

    static getBranchName(): string {
        return execSync(`${Git.cmd} rev-parse --abbrev-ref HEAD`).toString()
    }
}
