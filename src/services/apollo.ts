import {ApolloServer} from 'apollo-server-express'
import express from 'express'
import {AuthChecker} from 'type-graphql'
import {baseCookieOpts} from '../config/cookies'
import {firebase, verifyBearerHeader} from './firebase'
import {logHandledError} from './log'

export type ExpressContext = {
  req: express.Request
  res: express.Response
}

export type AppContext = ExpressContext & {
  idToken?: firebase.auth.DecodedIdToken
}

export type AuthorizedAppContext = ExpressContext & {
  idToken: firebase.auth.DecodedIdToken
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
  return Boolean(context.idToken)
}

export const generateRequestContext = async (context: ExpressContext): Promise<AppContext> => {
  try {
    if (context.req.headers.authorization) {
      const idToken = await verifyBearerHeader(context.req.headers.authorization)

      return {
        ...context,
        idToken,
      }
    }

    return context
  } catch (error) {
    logHandledError(error)

    // Clear auth cookies
    context.res.clearCookie('access', baseCookieOpts)

    return {
      ...context,
    }
  }
}
