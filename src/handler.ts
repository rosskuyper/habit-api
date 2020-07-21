import {ApolloServer} from 'apollo-server-lambda'
import {APIGatewayProxyCallback, APIGatewayProxyEventV2, Context as LambdaContext} from 'aws-lambda'
import {serverConfig} from './apollo'
import {marshallLambdaEvent} from './utils/apigwProxy'
import {deferPromiseCall} from './utils/async'

/**
 * We want the apollo server configured once, "outside" the handler. This allows the context to remain
 * in the lambda container for subsequent requests, making them more efficient.
 *
 * But we also don't want the actual setup to start running till the handler is called.
 * If there are errors we want our middleware to pick it up.
 */
const getServer = deferPromiseCall(async () => {
  const config = await serverConfig()

  return new ApolloServer(config)
})

const getHandler = deferPromiseCall(async () => {
  const server = await getServer()

  return server.createHandler({
    cors: {
      origin: '*',
      credentials: true,
    },
  })
})

const handler = async (
  event: APIGatewayProxyEventV2,
  context: LambdaContext,
  callback: APIGatewayProxyCallback,
): Promise<void> => {
  const apolloHandler = await getHandler()

  apolloHandler(marshallLambdaEvent(event), context, callback)
}

export default handler
