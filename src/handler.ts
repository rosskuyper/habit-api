import awsServerlessExpress from 'aws-serverless-express'
import {deferPromiseCall} from './utils/async'
import initExpress, {ExpressApolloBundle} from './app'
import {APIGatewayProxyEventV2, Context as LambdaContext} from 'aws-lambda'
import {marshallLambdaEvent} from './utils/apigwProxy'
import {Server} from 'http'

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

export async function handler(event: APIGatewayProxyEventV2, context: LambdaContext): Promise<void> {
  const {serverlessServer} = await getAppServerBundle()

  awsServerlessExpress.proxy(serverlessServer, marshallLambdaEvent(event), context)
}
