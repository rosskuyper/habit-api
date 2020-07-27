import {Arg, Mutation, Query, Resolver} from 'type-graphql'
import {UserSchema, AddUserInput} from '../schemas/UserSchema'
import {addUser, queryUser} from '../mappers/UserMapper'

@Resolver(UserSchema)
class UserResolver {
  @Query(() => UserSchema)
  async getUser(@Arg('sub') sub: string): Promise<UserSchema> {
    return queryUser(sub)
  }

  @Mutation(() => UserSchema)
  async addUser(@Arg('user') userInput: AddUserInput): Promise<UserSchema> {
    return addUser(userInput)
  }
}

export default UserResolver
