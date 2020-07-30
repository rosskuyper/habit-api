import {swapCodeForTokens} from '../utils/cognito/tokenSwap'
import {DecodedTokenSet, verifyTokenSet} from '../utils/cognito/jwt'
import {storeTokenSet, storeUser} from '../mappers/AuthMapper'
import {getProvider} from '../config/identityProviders'
import TokenModel from '../models/TokenModel'
import UserModel from '../models/UserModel'

type loginResult = {
  tokenSet: DecodedTokenSet
  user: UserModel
  token: TokenModel
}

export const processLoginPayload = async (code: string, clientId: string): Promise<loginResult> => {
  const {provider, secrets} = getProvider(clientId)

  const rawTokenSet = await swapCodeForTokens(code, {
    clientId: provider.clientId,
    clientSecret: secrets.clientSecret,
    tokenUri: provider.tokenUri,
    redirectUri: provider.redirectUri,
  })

  const decodedTokenSet = await verifyTokenSet(rawTokenSet, {
    authorizedIssuers: [provider.issuer],
    authorizedAudiences: [provider.clientId],
  })

  const [user, token] = await Promise.all([
    storeUser({
      subId: decodedTokenSet.accessToken.sub,
      email: decodedTokenSet.idToken.email,
      first: decodedTokenSet.idToken.given_name,
      last: decodedTokenSet.idToken.family_name,
    }),
    storeTokenSet({
      accessToken: decodedTokenSet.original.accessToken,
      refreshToken: decodedTokenSet.original.refreshToken,
      subId: decodedTokenSet.accessToken.sub,
    }),
  ])

  return {
    tokenSet: decodedTokenSet,
    user,
    token,
  }
}
