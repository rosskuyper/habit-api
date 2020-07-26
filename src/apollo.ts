import {Config} from 'apollo-server-lambda'
import {ApolloServerPlugin, BaseContext, GraphQLRequestContextWillSendResponse} from 'apollo-server-plugin-base'
import {APIGatewayProxyEvent, Context as LambdaContext} from 'aws-lambda'
import {buildSchema} from 'type-graphql'
import AuthResolver from './resolvers/AuthResolver'
import UserResolver from './resolvers/UserResolver'
import Bugsnag from './utils/bugsnag'

const headerPlugin: ApolloServerPlugin = {
  requestDidStart: () => {
    return {
      willSendResponse: (requestContext: GraphQLRequestContextWillSendResponse<BaseContext>): void => {
        if (requestContext.response.http) {
          for (const [headerKey, headerValue] of requestContext.context.additionalResponseHeaders.entries()) {
            requestContext.response.http.headers.set(headerKey, headerValue)
          }
        }

        console.log('requestContext.response.http', requestContext.response.http)
        console.log(
          'requestContext.context.additionalResponseHeaders',
          requestContext.context.additionalResponseHeaders,
        )
      },
    }
  },
}

export type RecievedContext = {
  event: APIGatewayProxyEvent
  lambdaContext: LambdaContext
}

export type Context = RecievedContext & {
  // This will let us add additional response headers from within resolvers
  additionalResponseHeaders: Map<string, string>
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

    context: async (context: RecievedContext): Promise<Context> => {
      return {
        ...context,
        additionalResponseHeaders: new Map(),
      }
    },
    formatError: (err) => {
      console.log(err)
      Bugsnag.notify(err)
      return err
    },
  }
}
