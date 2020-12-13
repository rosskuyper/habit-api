import {ObjectType, Field, ID, InputType} from 'type-graphql'

@ObjectType()
export class UserSchema {
  @Field(() => ID)
  sub!: string

  @Field({nullable: true})
  email?: string

  @Field({nullable: true})
  name?: string

  @Field()
  iat!: number

  @Field()
  exp!: number
}

@ObjectType()
export class MeSchema {
  @Field()
  user!: UserSchema
}
