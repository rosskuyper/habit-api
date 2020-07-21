import {Arg, Mutation, Query, Resolver} from 'type-graphql'
import {UserSchema, AddUserInput} from '../schemas/UserSchema'
import {addUser, getUser} from '../mappers/UserMapper'

@Resolver(UserSchema)
class UserResolver {
  @Query(() => UserSchema)
  async getUser(@Arg('userId') userId: string): Promise<UserSchema> {
    return getUser(userId)
  }

  @Mutation(() => UserSchema)
  async addUser(@Arg('user') userInput: AddUserInput): Promise<UserSchema> {
    return addUser(userInput)
  }
}

export default UserResolver
