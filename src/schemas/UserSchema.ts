import {ObjectType, Field, ID, InputType} from 'type-graphql'

@InputType()
export class AddUserInput {
  @Field()
  first!: string

  @Field()
  last!: string
}

@ObjectType()
export class UserSchema {
  @Field(() => ID)
  userId!: string

  @Field({nullable: true})
  first?: string

  @Field({nullable: true})
  last?: string

  @Field()
  updatedAt!: Date

  @Field()
  createdAt!: Date
}
