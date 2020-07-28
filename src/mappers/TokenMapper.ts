import TokenSet from '../models/TokenSetModel'
import {RawTokenSet} from '../utils/auth'
import {Cache, createCache} from '../utils/cache'
import {dynamoDbMapper} from '../utils/dynamodb'

const {remember}: Cache<TokenSet> = createCache()

export const storeTokenSet = async (tokenSet: RawTokenSet): Promise<TokenSet> => {
  const token = Object.assign(new TokenSet(), {id: tokenSet.accessToken}, tokenSet)

  return dynamoDbMapper.put(token)
}

export const getTokenSet = async (accessToken: string): Promise<TokenSet> => {
  return remember(accessToken, async () => {
    const token = Object.assign(new TokenSet(), {id: accessToken})

    return dynamoDbMapper.get(token)
  })
}
