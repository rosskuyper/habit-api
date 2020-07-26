import {ApolloServer} from 'apollo-server-lambda'
import {APIGatewayProxyEventV2, Context as LambdaContext, Callback} from 'aws-lambda'
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
      methods: 'GET, POST',
      allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    },
  })
})

/**
 * apollo-server-lambda internally uses the callback api and sets callbackWaitsForEmptyEventLoop to false
 * which can lead to the lambda function exiting early and `null` being returned to the user.
 *
 * Here we wrap this in a promise so that we can use our async context which will only fully resolve
 * once the apollo handler has called the callback.
 */
export async function handler(event: APIGatewayProxyEventV2, context: LambdaContext): Promise<void> {
  const apolloHandler = await getHandler()

  return new Promise((resolve, reject) => {
    const callback: Callback = (error, body) => {
      if (error) {
        reject(error)
      }

      console.log('body', body)

      resolve(body)
    }

    apolloHandler(marshallLambdaEvent(event), context, callback)
  })
}

export default handler
