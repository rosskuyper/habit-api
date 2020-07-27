import {ApolloServer} from 'apollo-server-express'
import express from 'express'
import {buildSchema} from 'type-graphql'
import {CORS_ALLOWED_ORIGINS, OUTPUT_ERRORS_TO_CONSOLE, PLAYGROUND_ENABLED} from './config'
import AuthResolver from './resolvers/AuthResolver'
import UserResolver from './resolvers/UserResolver'
import {Context, ExpressApolloBundle, playground} from './utils/apollo'
import Bugsnag from './utils/bugsnag'
import {generateOriginConfig} from './utils/http'

const initExpress = async (): Promise<ExpressApolloBundle> => {
  const app = express()

  const schema = await buildSchema({
    resolvers: [
      //
      UserResolver,
      AuthResolver,
    ],
  })

  const apolloServer = new ApolloServer({
    schema,
    playground: PLAYGROUND_ENABLED && playground,
    introspection: PLAYGROUND_ENABLED,

    // We need to define this to actually be given the items from express
    context: (context: Context): Context => context,

    // Error reporting happens here according to apollo
    formatError: (err) => {
      if (OUTPUT_ERRORS_TO_CONSOLE) {
        console.log(err)
      }

      Bugsnag.notify(err)
      return err
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
