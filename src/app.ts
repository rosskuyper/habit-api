import {ApolloServer} from 'apollo-server-express'
import cookieParser from 'cookie-parser'
import express from 'express'
import {buildSchema} from 'type-graphql'
import {customAuthChecker, ExpressApolloBundle, generateRequestContext, playground} from './services/apollo'
import {CORS_ALLOWED_ORIGINS, PLAYGROUND_ENABLED} from './config/env'
import AuthResolver from './resolvers/AuthResolver'
import {generateOriginConfig} from './utils/http'
import {logHandledError} from './services/log'

const initExpress = async (): Promise<ExpressApolloBundle> => {
  const app = express()

  app.use(cookieParser())

  const schema = await buildSchema({
    resolvers: [
      //
      AuthResolver,
    ],

    authChecker: customAuthChecker,
  })

  const apolloServer = new ApolloServer({
    schema,
    playground: PLAYGROUND_ENABLED && playground,
    introspection: PLAYGROUND_ENABLED,

    // We need to define this to actually be given the items from express
    context: generateRequestContext,

    // Error reporting happens here according to apollo
    formatError: (error) => {
      logHandledError(error)
      return error
    },
  })

  apolloServer.applyMiddleware({
    app,
    cors: {
      origin: generateOriginConfig(CORS_ALLOWED_ORIGINS),
      credentials: true,
      methods: 'GET, POST',
      allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
      maxAge: 84600,
    },
  })

  return {
    apolloServer,
    app,
  }
}

export default initExpress
