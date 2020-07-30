import TokenModel, {forgeToken} from '../models/TokenModel'
import {dynamoDbMapper} from '../utils/dynamodb'

export type StoreTokenSetParams = {
  accessToken: string
  refreshToken: string
  user: {
    subId: string
    email: string
    first: string
    last: string
  }
}

export const storeTokenSet = async ({accessToken, refreshToken, user}: StoreTokenSetParams): Promise<TokenModel> => {
  const token = forgeToken({
    subId: user.subId,
    accessToken,
    refreshToken,
  })

  return dynamoDbMapper.put(token)
}
