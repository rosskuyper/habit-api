import './utils/bugsnag'
import {ApolloServer, gql} from 'apollo-server-lambda'
import {APIGatewayProxyCallback, APIGatewayProxyEventV2, Context as LambdaContext} from 'aws-lambda'
import {marshallLambdaEvent} from './utils/apigwProxy'

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
`

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,

  // By default, the GraphQL Playground interface and GraphQL introspection
  // is disabled in "production" (i.e. when `process.env.NODE_ENV` is `production`).
  //
  // If you'd like to have GraphQL Playground and introspection enabled in production,
  // the `playground` and `introspection` options must be set explicitly to `true`.
  playground: true,
  introspection: true,
})

const handler = server.createHandler({
  cors: {
    origin: '*',
    credentials: true,
  },
})

exports.handler = (event: APIGatewayProxyEventV2, context: LambdaContext, callback: APIGatewayProxyCallback) => {
  return handler(marshallLambdaEvent(event), context, callback)
}
