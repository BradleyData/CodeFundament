import { Field, ObjectType } from "type-graphql"

@ObjectType()
export class Postgres {
    @Field()
        Test: boolean = false
}
