import {Arg, InputType, Mutation, Query, Resolver, Field} from 'type-graphql'
import UserSchema from '../schemas/User'

@InputType()
class AddUserInput {
  @Field()
  first!: string

  @Field()
  last!: string
}

@Resolver(UserSchema)
class UserResolver {
  @Query(() => UserSchema)
  async currentUser(): Promise<UserSchema> {
    return {
      userId: 'HEY JOANNA',
      first: 'HEY JOANNA',
      last: 'HEY JOANNA',
      updatedAt: new Date(),
      createdAt: new Date(),
    }
  }

  @Mutation(() => UserSchema)
  addUser(@Arg('user') user: AddUserInput): UserSchema {
    return {
      ...user,
      userId: 'HEY JOANNA',
      updatedAt: new Date(),
      createdAt: new Date(),
    }
  }
}

export default UserResolver
