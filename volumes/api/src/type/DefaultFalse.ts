// This can be used to prevent mutation testing from complaining about untestable
// defaults that cannot be reached (i.e. Setting the actual value in a callback).
export class DefaultFalse {
    value: boolean = false
}
