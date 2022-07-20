import { execSync } from "child_process"

export class Git {
    private static workTree = "/home/node/gitRepos/current"
    private static gitDir = `${Git.workTree}/.git`
    private static cmd = `git --work-tree=${Git.workTree} --git-dir=${Git.gitDir}`

    static getBranchName(): string {
        return execSync(`${Git.cmd} rev-parse --abbrev-ref HEAD`).toString()
    }

    static getBranchParent(): string {
        return execSync(
            `${Git.cmd} show-branch --merge-base ${Git.getDefaultBranch()}`
        ).toString()
    }

    static getDefaultBranch(): string {
        const path = "refs/remotes/origin/"

        return execSync(
            `${Git.cmd} symbolic-ref ${path}HEAD | sed 's@^${path}@@'`
        ).toString()
    }

    static retrieveBranch({
        branchType,
    }: {
        branchType: Git.branchType
    }): void {
        const branch = {
            [Git.branchType.prime]: Git.getBranchParent(),
            [Git.branchType.production]: Git.getDefaultBranch(),
        }[branchType]

        updateGit()
        addWorktree()
        retrieveFiles()
        removeWorktree()

        function updateGit(): void {
            execSync(`${Git.cmd} fetch --all`)
        }

        function addWorktree(): void {
            removeWorktree()
            execSync(
                `${Git.cmd} worktree add -f -f /home/node/gitRepos/${branchType} ${branch}`
            )
        }

        function removeWorktree(): void {
            execSync(
                `${Git.cmd} worktree remove --force /home/node/gitRepos/${branchType} 2>/dev/null || true`
            )
        }

        function retrieveFiles(): void {
            execSync(`rm -rf /home/node/volumes/api${branchType}/*`)
            execSync(
                `mv /home/node/gitRepos/${branchType}/volumes/api/* /home/node/volumes/api${branchType}/`
            )
            execSync(`touch /home/node/volumes/api${branchType}/src/.gitkeep`)

            const fromSchema = `/home/node/gitRepos/${branchType}/volumes/dbmigration/migrations/schema.sql`
            const toSchema = `/home/node/migrations/schema${branchType}.sql`
            execSync(`mv ${fromSchema} ${toSchema} || touch ${toSchema}`)
        }
    }

    static runAcceptanceTests({
        branchType,
    }: {
        branchType: Git.branchType | ""
    }): {
        output: string
        successful: boolean
    } {
        const result = {
            output: "",
            successful: false,
        }

        try {
            const ignoreKnownHosts =
                "-o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no"
            const containerName = `api${branchType}`

            result.output = execSync(
                `ssh ${ignoreKnownHosts} ${containerName} npm run acceptanceTests 2>&1`
            ).toString()
            result.successful = true
        } catch (error) {
            result.output += getOutputAndError(error as ExecSyncError)

            function getOutputAndError(execSyncError: ExecSyncError): string {
                return `${execSyncError.stdout.toString()}<br><br>${execSyncError.stderr.toString()}`
            }

            class ExecSyncError {
                stdout: Buffer = Buffer.from("")
                stderr: Buffer = Buffer.from("")
            }
        }

        return result
    }
}

/* eslint-disable no-redeclare */
export namespace Git {
    /* eslint-enable no-redeclare */
    /* eslint-disable no-shadow, no-unused-vars */
    export enum branchType {
        prime = "prime",
        production = "production",
    }
    /* eslint-enable no-shadow, no-unused-vars */
}
