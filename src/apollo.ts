import {Config} from 'apollo-server-lambda'
import {buildSchema} from 'type-graphql'
import AuthResolver from './resolvers/AuthResolver'
import UserResolver from './resolvers/UserResolver'
import Bugsnag from './utils/bugsnag'
import {ApolloServerPlugin, GraphQLRequestContextWillSendResponse, BaseContext} from 'apollo-server-plugin-base'
import {v4} from 'uuid'

const headerPlugin: ApolloServerPlugin = {
  requestDidStart: () => {
    return {
      willSendResponse: (requestContext: GraphQLRequestContextWillSendResponse<BaseContext>): void => {
        console.log('requestContext', requestContext)
      },
    }
  },
}

export const serverConfig = async (): Promise<Config> => {
  const schema = await buildSchema({
    resolvers: [
      //
      UserResolver,
      AuthResolver,
    ],
  })

  return {
    schema,
    playground: true,
    introspection: true,

    plugins: [headerPlugin],

    context: async (context) => {
      context.headerBag = {
        uuid: v4(),
      }

      console.log('setup', Object.keys(context))
      console.log('setup', context)

      return context
    },
    formatError: (err) => {
      console.log(err)
      Bugsnag.notify(err)
      return err
    },
  }
}
