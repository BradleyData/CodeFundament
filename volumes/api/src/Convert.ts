export class Convert {
    static errorNotAnInteger = new Error("Not a number.")

    static stringToInteger({ inputString }: { inputString: string }): number {
        const output = Number(inputString)

        if (inputString === "" || !Number.isInteger(output))
            throw this.errorNotAnInteger

        return output
    }

    static urlParametersToObject({
        urlParameters,
    }: {
        urlParameters: string
    }): { [key: string]: string } {
        const noParameters: { [key: string]: string } = {}
        const trimmedParameters =
            urlParameters.slice(0, 1) === "/"
                ? urlParameters.slice(1)
                : urlParameters

        if (trimmedParameters === "") 
            return noParameters

        return trimmedParameters.split("/").reduce((result, item, index) => {
            const pair = item.split("=")
            /* eslint-disable no-negated-condition */
            const key = pair.length !== 1 ? pair[0] : index.toString()
            const value = pair.length !== 1 ? pair[1] : pair[0]
            /* eslint-enable no-negated-condition */
            result[key] = value
            return result
        }, noParameters)
    }
}
