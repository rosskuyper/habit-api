import {AuthChecker} from 'type-graphql'
import {AppContext, ExpressContext} from './apollo'
import {AccessToken, IdToken, decodeAccessToken, decodeIdToken} from './cognito/jwt'
import {getTokenSet} from '../mappers/TokenMapper'
import {getUser} from '../mappers/UserMapper'
import {logHandledError} from './log'

export type RawTokenSet = {
  accessToken: string
  refreshToken: string
  idToken: string
}

export type DecodedTokenSet = {
  accessToken: AccessToken
  idToken: IdToken
}

export const customAuthChecker: AuthChecker<AppContext> = async ({context}) => Boolean(context.user && context.tokenSet)

const getUserAndTokenSet = async (accessToken: string) => {
  if (!accessToken) {
    return {}
  }

  const tokenSet = await getTokenSet(accessToken)
  const decodedTokenSet = decodeTokenSet(tokenSet)
  const user = await getUser(decodedTokenSet)

  return {
    user,
    tokenSet,
  }
}

export const generateRequestContext = async (context: ExpressContext): Promise<AppContext> => {
  try {
    const {user, tokenSet} = await getUserAndTokenSet(context.req?.cookies?.access)

    return {
      ...context,
      user,
      tokenSet,
    }
  } catch (error) {
    logHandledError(error)

    // Clear auth cookies
    context.res.clearCookie('access')

    return {
      ...context,
    }
  }
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
