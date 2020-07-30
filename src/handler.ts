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

// Awaiting this directly will resolve to the same value with each request that comes in
const serverBundlePromise = getAppServerBundle()

export async function handler(event: APIGatewayProxyEventV2, context: LambdaContext): Promise<Response> {
  // We don't actually need the whole bundle, just the serverless-express layer
  const {serverlessServer} = await serverBundlePromise

  /**
   * This project is configured to use the new(er) api gateway http integration.
   * The event comes through in a newer structure, which needs to be transformed / marshalled
   * into the older format.
   *
   * NB: For a production environment it would be prudent to either get first-class support for the new event
   * format in aws-serverless-express or alter the infrastructure to use the older payload format.
   * The reason I opted not to use the old format is that it's not configurable with the very
   * convenient `aws_apigatewayv2_api` resource.
   */
  const eventV1 = marshallLambdaEvent(event)

  /**
   * Because our handler is a promise, we need aws-serverless-express to abide by that contract too.
   * Changing this to use another `resolutionMode` will result in the lambda exiting preemptively.
   */
  return awsServerlessExpress.proxy(serverlessServer, eventV1, context, 'PROMISE').promise
}
