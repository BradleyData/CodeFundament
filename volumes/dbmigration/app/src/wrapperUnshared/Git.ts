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

    static retrievePrime(): void {
        execSync(`${Git.cmd} fetch --all`)
        execSync(`${Git.cmd} worktree remove --force /home/node/gitRepos/prime 2>/dev/null || true`)
        execSync(`${Git.cmd} worktree add /home/node/gitRepos/prime ${Git.getBranchParent()}`)
        execSync(`rm -rf /home/node/volumes/apiprime/*`)
        execSync(`mv /home/node/gitRepos/prime/volumes/api/* /home/node/volumes/apiprime/`)
        execSync(`touch /home/node/volumes/apiprime/src/.gitkeep`)
        execSync(`mv /home/node/gitRepos/prime/volumes/dbmigration/migrations/schema.sql /home/node/migrations/schemaPrime.sql || touch /home/node/migrations/schemaPrime.sql`)
        execSync(`${Git.cmd} worktree remove --force /home/node/gitRepos/prime 2>/dev/null || true`)
    }

    static retrieveProduction(): void {
        execSync(`${Git.cmd} fetch --all`)
        execSync(`${Git.cmd} worktree remove --force /home/node/gitRepos/production 2>/dev/null || true`)
        execSync(`${Git.cmd} worktree add /home/node/gitRepos/production ${Git.getBranchParent()}`)
        execSync(`rm -rf /home/node/volumes/apiproduction/*`)
        execSync(`mv /home/node/gitRepos/production/volumes/api/* /home/node/volumes/apiproduction/`)
        execSync(`touch /home/node/volumes/apiproduction/src/.gitkeep`)
        execSync(`mv /home/node/gitRepos/production/volumes/dbmigration/migrations/schema.sql /home/node/migrations/schemaProduction.sql || touch /home/node/migrations/schemaProduction.sql`)
        execSync(`${Git.cmd} worktree remove --force /home/node/gitRepos/production 2>/dev/null || true`)
    }
}
