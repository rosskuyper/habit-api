import {ApolloServer} from 'apollo-server-lambda'
import {
  APIGatewayProxyCallback,
  APIGatewayProxyEvent,
  APIGatewayProxyEventV2,
  Context as LambdaContext,
  Callback,
} from 'aws-lambda'
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

// const getHandler = deferPromiseCall(async () => {
//   const server = await getServer()

//   return server.createHandler({
//     cors: {
//       origin: '*',
//       credentials: true,
//     },
//   })
// })

// const handler = async (
//   event: APIGatewayProxyEventV2,
//   context: LambdaContext,
//   callback: APIGatewayProxyCallback,
// ): Promise<void> => {
//   const apolloHandler = await getHandler()

//   apolloHandler(marshallLambdaEvent(event), context, callback)
// }

type ApolloHanlder = (event: APIGatewayProxyEvent, context: LambdaContext, callback: APIGatewayProxyCallback) => void

function runApollo(event: APIGatewayProxyEvent, context: LambdaContext, apollo: ApolloHanlder) {
  return new Promise((resolve, reject) => {
    const callback: Callback = (error, body) => (error ? reject(error) : resolve(body))

    apollo(event, context, callback)
  })
}

export async function handler(event: APIGatewayProxyEventV2, context: LambdaContext): Promise<any> {
  const server = await getServer()

  const apollo = server.createHandler({
    cors: {
      origin: '*',
      credentials: true,
      methods: 'GET, POST',
      allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    },
  })

  return await runApollo(marshallLambdaEvent(event), context, apollo)
}

export default handler
