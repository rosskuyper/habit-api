import {ApolloServer} from 'apollo-server-lambda'
import {APIGatewayProxyCallback, APIGatewayProxyEventV2, Context as LambdaContext} from 'aws-lambda'
import {serverConfig} from './apollo'
import {marshallLambdaEvent} from './utils/apigwProxy'

const server = new ApolloServer(serverConfig)

export const apolloHandler = server.createHandler({
  cors: {
    origin: '*',
    credentials: true,
  },
})

const handler = (event: APIGatewayProxyEventV2, context: LambdaContext, callback: APIGatewayProxyCallback): void => {
  apolloHandler(marshallLambdaEvent(event), context, callback)
}

export default handler
