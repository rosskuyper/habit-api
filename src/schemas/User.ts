import {ObjectType, Field, ID} from 'type-graphql'

@ObjectType()
export class UserSchema {
  @Field(() => ID)
  userId!: string

  @Field({nullable: true})
  first!: string

  @Field({nullable: true})
  last!: string

  @Field()
  updatedAt!: Date

  @Field()
  createdAt!: Date
}

export default UserSchema
