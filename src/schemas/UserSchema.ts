import {ObjectType, Field, ID, InputType} from 'type-graphql'

@InputType()
export class AddUserInput {
  @Field()
  first!: string

  @Field()
  last!: string

  @Field()
  email!: string
}

@ObjectType()
export class UserSchema {
  @Field(() => ID)
  sub!: string

  @Field()
  email!: string

  @Field({nullable: true})
  first?: string

  @Field({nullable: true})
  last?: string

  @Field()
  updatedAt!: Date

  @Field()
  createdAt!: Date
}
