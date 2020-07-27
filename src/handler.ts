import {APIGatewayProxyEventV2, Context as LambdaContext} from 'aws-lambda'
import awsServerlessExpress from 'aws-serverless-express'
import {Server} from 'http'
import initExpress from './app'
import {marshallLambdaEvent} from './utils/apigwProxy'
import {ExpressApolloBundle} from './utils/apollo'
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

export async function handler(event: APIGatewayProxyEventV2, context: LambdaContext): Promise<void> {
  const {serverlessServer} = await getAppServerBundle()

  awsServerlessExpress.proxy(serverlessServer, marshallLambdaEvent(event), context)
}
