import {APIGatewayProxyCallback, APIGatewayProxyEventV2, Context as LambdaContext} from 'aws-lambda'
import {marshallLambdaEvent} from './utils/apigwProxy'
import {server} from './apollo'

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
