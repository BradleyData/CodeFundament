export class Log {
    static error({
        action,
        error,
        url,
    }: {
        action: string
        error: any
        url: string
    }): void {
        const e = error as Error
        console.log(`action: ${action}`)
        console.log(`url: ${url}`)
        console.log(e.stack ?? `${e.name}: ${e.message} (stack missing)`)
    }
}
