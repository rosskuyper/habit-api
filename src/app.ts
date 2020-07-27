import {ApolloServer} from 'apollo-server-express'
import cookieParser from 'cookie-parser'
import express from 'express'
import {buildSchema} from 'type-graphql'
import {CORS_ALLOWED_ORIGINS, OUTPUT_ERRORS_TO_CONSOLE, PLAYGROUND_ENABLED} from './config'
import AuthResolver from './resolvers/AuthResolver'
import UserResolver from './resolvers/UserResolver'
import {AppContext, ExpressApolloBundle, ExpressContext, playground} from './utils/apollo'
import {customAuthChecker, decodeTokenSet} from './utils/auth'
import Bugsnag from './utils/bugsnag'
import {generateOriginConfig} from './utils/http'
import {getTokenSet} from './mappers/TokenMapper'
import {getUser} from './mappers/UserMapper'

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
    context: async (context: ExpressContext): Promise<AppContext> => {
      const tokenSet = context.req?.cookies?.access ? await getTokenSet(context.req.cookies.access) : undefined

      const decodedTokenSet = tokenSet && decodeTokenSet(tokenSet)

      const user = decodedTokenSet && (await getUser(decodedTokenSet))

      return {
        ...context,
        user,
        tokenSet,
      }
    },

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
