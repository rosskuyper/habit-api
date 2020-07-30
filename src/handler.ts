import {APIGatewayProxyEventV2, Context as LambdaContext} from 'aws-lambda'
import awsServerlessExpress, {Response} from 'aws-serverless-express'
import {Server} from 'http'
import initExpress from './express-app'
import {ExpressApolloBundle} from './services/apollo'
import {marshallLambdaEvent} from './utils/apigwProxy'

/**
 * Within the lambda environment we have three "servers"
 * 1) The aws-serverless-express layer, which handles the incoming lambda event, making it usable by express.
 * 2) Express, which handles the request given to it be aws-serverless-express as if it were a direct HTTP request.
 * 3) Apollo, which handles the GraphQL aspect of the request.
 *
 * This bundle encapsulates those three components.
 */
type AppServerBundle = ExpressApolloBundle & {
  serverlessServer: Server
}

/**
 * As an optimization for lambda, once the servers are instantiated, they are capable of processing multiple requests.
 * By putting this outside the lambda handler() function it can persist between subsequent requests in the
 * lambda execution context making subsequent requests faster.
 *
 * https://docs.aws.amazon.com/lambda/latest/dg/runtimes-context.html
 */
const getAppServerBundle = async (): Promise<AppServerBundle> => {
  const {app, apolloServer} = await initExpress()

  const serverlessServer = awsServerlessExpress.createServer(app)

  return {
    app,
    apolloServer,
    serverlessServer,
  }
}

const serverBundlePromise = getAppServerBundle()

export async function handler(event: APIGatewayProxyEventV2, context: LambdaContext): Promise<Response> {
  // This will resolve to the same value with each request that comes in
  const {serverlessServer} = await serverBundlePromise

  const eventV1 = marshallLambdaEvent(event)

  return awsServerlessExpress.proxy(serverlessServer, eventV1, context, 'PROMISE').promise
}
