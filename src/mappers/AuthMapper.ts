import {dynamoDbMapper} from '../utils/dynamodb'
import AuthModel from '../models/AuthModel'
import {TokenSet} from '../utils/cognito/tokenSwap'

export const storeTokenSet = async (tokenSet: TokenSet): Promise<AuthModel> => {
  const token = Object.assign(new AuthModel(), tokenSet)

  return dynamoDbMapper.put(token)
}
