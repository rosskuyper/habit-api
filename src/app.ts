import {ApolloServer} from 'apollo-server-express'
import cookieParser from 'cookie-parser'
import express from 'express'
import {buildSchema} from 'type-graphql'
import {CORS_ALLOWED_ORIGINS, PLAYGROUND_ENABLED} from './config'
import AuthResolver from './resolvers/AuthResolver'
import UserResolver from './resolvers/UserResolver'
import {ExpressApolloBundle, playground} from './utils/apollo'
import {customAuthChecker, generateRequestContext} from './utils/auth'
import {generateOriginConfig} from './utils/http'
import {logHandledError} from './utils/log'

const initExpress = async (): Promise<ExpressApolloBundle> => {
  const app = express()

  app.use(cookieParser())

  const schema = await buildSchema({
    resolvers: [
      //
      UserResolver,
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
    },
  })

  return {
    apolloServer,
    app,
  }
}

export default initExpress
