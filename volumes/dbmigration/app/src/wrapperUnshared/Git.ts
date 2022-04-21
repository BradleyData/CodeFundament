import { execSync } from "child_process"

export class Git {
    private static workTree = "/home/node/gitRepo"
    private static gitDir = `${Git.workTree}/.git`
    private static cmd = `git --work-tree=${Git.workTree} --git-dir=${Git.gitDir}`

    static retrieveOriginalFile({from, to}: {from: string, to: string}): void {
        const externalPath = 'volumes/dbmigration/migrations/'
        const internalPath = '/home/node/migrations/'

        const fullFrom = `${externalPath}${from}`
        const fullTo = `${internalPath}${to}`

        execSync(`${Git.cmd} show ${Git.getBranchParent()}:${fullFrom} 2>/dev/null > ${fullTo} || true`)
    }

    static getBranchName(): string {
        return execSync(`${Git.cmd} rev-parse --abbrev-ref HEAD`).toString()
    }

    static getBranchParent(): string {
        return execSync(`${Git.cmd} show-branch --merge-base ${Git.getDefaultBranch()}`).toString()
    }

    static getDefaultBranch(): string {
        const path = 'refs/remotes/origin/'

        return execSync(`${Git.cmd} symbolic-ref ${path}HEAD | sed 's@^${path}@@'`).toString()
    }
}
