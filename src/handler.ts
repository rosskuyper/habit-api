import {APIGatewayProxyEventV2, Context as LambdaContext} from 'aws-lambda'
import awsServerlessExpress, {Response} from 'aws-serverless-express'
import {Server} from 'http'
import initExpress from './app'
import {ExpressApolloBundle} from './services/apollo'
import {marshallLambdaEvent} from './utils/apigwProxy'
import {deferPromiseCall} from './utils/async'

type AppServerBundle = ExpressApolloBundle & {
  serverlessServer: Server
}

const getAppServerBundle = deferPromiseCall(
  async (): Promise<AppServerBundle> => {
    const {app, apolloServer} = await initExpress()

    const serverlessServer = awsServerlessExpress.createServer(app)

    return {
      app,
      apolloServer,
      serverlessServer,
    }
  },
)

export async function handler(event: APIGatewayProxyEventV2, context: LambdaContext): Promise<Response> {
  const {serverlessServer} = await getAppServerBundle()

  return awsServerlessExpress.proxy(serverlessServer, marshallLambdaEvent(event), context, 'PROMISE').promise
}
