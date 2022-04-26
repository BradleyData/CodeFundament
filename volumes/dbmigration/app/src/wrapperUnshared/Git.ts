import { execSync } from "child_process"

export class Git {
    private static workTree = "/home/node/gitRepos/current"
    private static gitDir = `${Git.workTree}/.git`
    private static cmd = `git --work-tree=${Git.workTree} --git-dir=${Git.gitDir}`

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

    private static retrieveP({pType, branch}: {pType: string, branch: string}): void {
        updateGit()
        addWorktree()
        retrieveFiles()
        removeWorktree()

        function updateGit(): void {
            execSync(`${Git.cmd} fetch --all`)
        }

        function addWorktree(): void {
            removeWorktree()
            execSync(`${Git.cmd} worktree add /home/node/gitRepos/${pType} ${branch}`)
        }

        function removeWorktree(): void {
            execSync(`${Git.cmd} worktree remove --force /home/node/gitRepos/${pType} 2>/dev/null || true`)
        }

        function retrieveFiles(): void {
            execSync(`rm -rf /home/node/volumes/api${pType}/*`)
            execSync(`mv /home/node/gitRepos/${pType}/volumes/api/* /home/node/volumes/api${pType}/`)
            execSync(`touch /home/node/volumes/api${pType}/src/.gitkeep`)
            execSync(`mv /home/node/gitRepos/${pType}/volumes/dbmigration/migrations/schema.sql /home/node/migrations/schema${pType}.sql || touch /home/node/migrations/schema${pType}.sql`)
        }
    }

    static retrievePrime(): void {
        Git.retrieveP({pType: 'prime', branch: Git.getBranchParent()})
    }

    static retrieveProduction(): void {
        Git.retrieveP({pType: 'production', branch: Git.getDefaultBranch()})
    }
}
