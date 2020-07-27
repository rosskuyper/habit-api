import {AddUserInput, UserSchema} from '../schemas/UserSchema'
import {dynamoDbMapper} from '../utils/dynamodb'
import UserModel from '../models/UserModel'
import {DecodedTokenSet} from '../utils/auth'

export const addUser = async (userInput: AddUserInput): Promise<UserSchema> => {
  const user = Object.assign(new UserModel(), userInput)

  return dynamoDbMapper.put(user)
}

export const queryUser = async (userId: string): Promise<UserSchema> => {
  const user = Object.assign(new UserModel(), {userId})

  return dynamoDbMapper.get(user)
}

export const getUser = async ({idToken}: DecodedTokenSet): Promise<UserSchema> => {
  const user = Object.assign(new UserModel(), {
    sub: idToken.sub,
    email: idToken.email,
  })

  return user
}
