import * as RealCrypto from "crypto"

export class Crypto {
    static getSalt(): string {
        const size = 128
        return RealCrypto.randomBytes(size).toString("base64")
    }
}
