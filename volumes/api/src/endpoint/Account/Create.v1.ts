import { Convert } from "../../Convert"
import { Crypto } from "../../wrapper/Crypto"
import { Endpoint } from "../../Endpoint"
import { Postgres } from "../../wrapper/Postgres"

class Create extends Endpoint {
    protected async post(): Promise<void> {
        try {
            if (this.parameters.username === undefined)
                throw new Error("Missing username.")
            if (this.parameters.loginVersion === undefined)
                throw new Error("Missing loginVersion.")

            this.rowsAffected = await Postgres.query({
                sql: `
                    INSERT INTO login (username, version, salt, password)
                    VALUES ($1::text, $2::number, $3::text, $4::text)`,
                values: [
                    this.parameters.username,
                    Convert.stringToInteger({
                        inputString: this.parameters.loginVersion,
                    }),
                    Crypto.getSalt(),
                    "",
                ],
            })
        } catch (error) {
            this.returnError({
                error,
                output: { username: this.parameters.username },
            })
        }
    }
}

export { Create, Create as Endpoint }
