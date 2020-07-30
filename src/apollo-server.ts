import {ApolloServer} from 'apollo-server-express'
import {buildSchema} from 'type-graphql'
import {PLAYGROUND_ENABLED} from './config/env'
import AuthResolver from './resolvers/AuthResolver'
import {customAuthChecker, generateRequestContext, playground} from './services/apollo'
import {logHandledError} from './services/log'

/**
 * The Apollo Server - handles all GraphQL requests
 */
const createServer = async (): Promise<ApolloServer> => {
  /**
   * Our schema is built by type-graphql.
   * Resolvers define what queries and mutations should exist,
   * along with their associated return and input types.
   */
  const schema = await buildSchema({
    resolvers: [
      //
      AuthResolver,
    ],

    // This checks that we found and successfully parsed an access token
    // and that it exists on the context object.
    // This is only run for resolvers with the @Authorized() decorator.
    authChecker: customAuthChecker,
  })

  const apolloServer = new ApolloServer({
    // The schema built above.
    schema,

    // User interface that is available at `/graphql` if enabled. For local / dev only.
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
