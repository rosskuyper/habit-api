import {swapCodeForTokens} from '../utils/cognito/tokenSwap'
import {DecodedTokenSet, verifyTokenSet} from '../utils/cognito/jwt'
import {storeTokenSet} from '../mappers/AuthMapper'
import {getProvider} from '../config/identityProviders'

export const processLoginPayload = async (code: string, clientId: string): Promise<DecodedTokenSet> => {
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

  await storeTokenSet({
    accessToken: decodedTokenSet.original.accessToken,
    refreshToken: decodedTokenSet.original.refreshToken,
    user: {
      subId: decodedTokenSet.accessToken.sub,
      email: decodedTokenSet.idToken.email,
      first: '',
      last: '',
    },
  })

  return decodedTokenSet
}
