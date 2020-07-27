import express from 'express'
import {ApolloServer} from 'apollo-server-express'
import TokenSet from '../models/TokenSetModel'
import UserModel from '../models/UserModel'

export type ExpressContext = {
  req: express.Request
  res: express.Response
}

export type AppContext = ExpressContext & {
  user?: UserModel
  tokenSet?: TokenSet
}

export type AuthorizedAppContext = ExpressContext & {
  user: UserModel
  tokenSet: TokenSet
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
