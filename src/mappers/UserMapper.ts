import {AddUserInput, UserSchema} from '../schemas/UserSchema'
import {dynamoDbMapper} from '../utils/dynamodb'
import UserModel from '../models/UserModel'

export const addUser = async (userInput: AddUserInput): Promise<UserSchema> => {
  const user = Object.assign(new UserModel(), userInput)

  return dynamoDbMapper.put(user)
}

export const getUser = async (userId: string): Promise<UserSchema> => {
  const user = Object.assign(new UserModel(), {userId})

  return dynamoDbMapper.get(user)
}
