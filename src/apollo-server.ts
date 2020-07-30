import {ApolloServer} from 'apollo-server-express'
import {buildSchema} from 'type-graphql'
import {PLAYGROUND_ENABLED} from './config/env'
import AuthResolver from './resolvers/AuthResolver'
import {customAuthChecker, generateRequestContext, playground} from './services/apollo'
import {logHandledError} from './services/log'

const createServer = async (): Promise<ApolloServer> => {
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

  return apolloServer
}

export default createServer
