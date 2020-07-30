import {ApolloServer} from 'apollo-server-express'
import express from 'express'
import {AuthChecker} from 'type-graphql'
import {AccessToken, verifyToken} from '../utils/jwt'
import {logHandledError} from './log'
import {baseCookieOpts} from '../config/cookies'
import {authorizedClientIds, authorizedIssuers} from '../config/identityProviders'

export type ExpressContext = {
  req: express.Request
  res: express.Response
}

export type AppContext = ExpressContext & {
  accessToken?: AccessToken
}

export type AuthorizedAppContext = ExpressContext & {
  accessToken: AccessToken
}

export type ExpressApolloBundle = {
  apolloServer: ApolloServer
  app: express.Express
}

export const playground = {
  settings: {
    'request.credentials': 'include',
  },
}

/**
 * Used by the `@Authorized` decorator for a resolver query / mutation
 */
export const customAuthChecker: AuthChecker<AppContext> = async ({context}) => {
  return Boolean(context.accessToken)
}

/**
 * Middleware to create the request context
 */
const verifyOpts = {
  authorizedIssuers,
  authorizedAudiences: authorizedClientIds,
}

export const generateRequestContext = async (context: ExpressContext): Promise<AppContext> => {
  try {
    const accessToken = context.req.cookies?.access
      ? await verifyToken<AccessToken>(context.req.cookies?.access, verifyOpts, 'access')
      : undefined

    return {
      ...context,
      accessToken,
    }
  } catch (error) {
    logHandledError(error)

    // Clear auth cookies
    context.res.clearCookie('access', baseCookieOpts)

    return {
      ...context,
    }
  }
}
