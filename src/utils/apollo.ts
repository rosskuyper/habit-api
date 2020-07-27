import express from 'express'
import {ApolloServer} from 'apollo-server-express'

export type Context = {
  req: express.Request
  res: express.Response
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
