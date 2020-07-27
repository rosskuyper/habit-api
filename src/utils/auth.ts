import {AuthChecker} from 'type-graphql'
import {AppContext} from './apollo'
import {AccessToken, IdToken, decodeAccessToken, decodeIdToken} from './cognito/jwt'

export type RawTokenSet = {
  accessToken: string
  refreshToken: string
  idToken: string
}

export type DecodedTokenSet = {
  accessToken: AccessToken
  idToken: IdToken
}

export const customAuthChecker: AuthChecker<AppContext> = async ({context}) => {
  return Boolean(context.user && context.tokenSet)
}

export const decodeTokenSet = (tokenSet: RawTokenSet): DecodedTokenSet => {
  return {
    accessToken: decodeAccessToken(tokenSet.accessToken),
    idToken: decodeIdToken(tokenSet.idToken),
  }
}

export const verifyTokenResult = (result: {
  access_token: string
  refresh_token: string
  id_token: string
}): RawTokenSet => {
  if (!result) {
    throw new Error('Empty Cognito token payload')
  }

  const {access_token: accessToken, refresh_token: refreshToken, id_token: idToken} = result

  if (!accessToken || !refreshToken || !idToken) {
    throw new Error('Invalid Cognito token payload')
  }

  const tokenSet = {
    accessToken,
    refreshToken,
    idToken,
  }

  // This also validates the token set
  decodeTokenSet(tokenSet)

  return tokenSet
}
