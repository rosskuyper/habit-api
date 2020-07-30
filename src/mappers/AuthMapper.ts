import TokenModel, {forgeToken} from '../models/TokenModel'
import UserModel, {forgeUser, forgeUserForStore} from '../models/UserModel'
import {dynamoDbMapper} from '../utils/dynamodb'

export type StoreTokenSetParams = {
  accessToken: string
  refreshToken: string
  subId: string
}

export type StoreUserParams = {
  subId: string
  email: string
  first: string
  last: string
}

export const storeTokenSet = async (params: StoreTokenSetParams): Promise<TokenModel> => {
  // Forge the token
  const tokenEntity = forgeToken({
    subId: params.subId,
    accessToken: params.accessToken,
    refreshToken: params.refreshToken,
  })

  return dynamoDbMapper.put(tokenEntity)
}

export const storeUser = async (params: StoreUserParams): Promise<UserModel> => {
  // Forge the user
  const userEntity = forgeUserForStore({
    subId: params.subId,
    email: params.email,
    first: params.first,
    last: params.last,
  })

  return dynamoDbMapper.put(userEntity)
}

export const getUserBySubId = async (subId: string): Promise<UserModel> => {
  // Forge the user
  const userEntity = forgeUser({
    subId,
  })

  return dynamoDbMapper.get(userEntity)
}
