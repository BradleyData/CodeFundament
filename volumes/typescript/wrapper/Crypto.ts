import * as RealCrypto from "crypto"

export class Crypto {
    static generateKeyPair(): { publicKey: string; privateKey: string } {
        return RealCrypto.generateKeyPairSync("rsa", {
            modulusLength: 4096,
            privateKeyEncoding: {
                cipher: "aes-256-cbc",
                format: "pem",
                type: "pkcs8",
            },
            publicKeyEncoding: {
                format: "pem",
                type: "spki",
            },
        })
    }

    static getSalt(): string {
        const size = 128
        return RealCrypto.randomBytes(size).toString("base64")
    }
}
