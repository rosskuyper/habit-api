import './utils/bugsnag'
import {ApolloServer, gql} from 'apollo-server-lambda'
import queryString from 'query-string'
import {
  APIGatewayProxyCallback,
  APIGatewayProxyEvent,
  APIGatewayProxyEventV2,
  Context as LambdaContext,
} from 'aws-lambda'

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

type SingleValueObject = {
  [name: string]: string
}

type MultiValueObject = {
  [name: string]: string[]
}

type SingleOrMultiValueObject = {
  [name: string]: string[] | string | null | undefined
}

const parseMultiValueHeaders = (headers: SingleValueObject): MultiValueObject => {
  const headerPairs = Object.keys(headers).map((headerKey) => {
    return [headerKey, [headers[headerKey]]]
  })

  return Object.fromEntries(headerPairs)
}

const ensureSingleQueryParams = (parsedQueryParams: SingleOrMultiValueObject): SingleValueObject => {
  const queryPairs = Object.keys(parsedQueryParams).map((paramKey) => {
    const param = parsedQueryParams[paramKey]

    return [paramKey, Array.isArray(param) ? param[0] : param]
  })

  return Object.fromEntries(queryPairs)
}

const ensureMultiQueryParams = (parsedQueryParams: SingleOrMultiValueObject): MultiValueObject => {
  const queryPairs = Object.keys(parsedQueryParams).map((paramKey) => {
    const param = parsedQueryParams[paramKey]

    return [paramKey, Array.isArray(param) ? param : [param]]
  })

  return Object.fromEntries(queryPairs)
}

const marshallLambdaEvent = (event: APIGatewayProxyEventV2): APIGatewayProxyEvent => {
  const parsedQueryParams = event.rawQueryString ? queryString.parse(event.rawQueryString) : null

  return {
    body: event.body || null,
    headers: event.headers,
    multiValueHeaders: parseMultiValueHeaders(event.headers),
    httpMethod: event.requestContext.http.method,
    isBase64Encoded: event.isBase64Encoded,
    path: event.requestContext.http.path,
    pathParameters: null,
    queryStringParameters: parsedQueryParams ? ensureSingleQueryParams(parsedQueryParams) : null,
    multiValueQueryStringParameters: parsedQueryParams ? ensureMultiQueryParams(parsedQueryParams) : null,
    stageVariables: null,
    requestContext: {
      ...event.requestContext,
      httpMethod: event.requestContext.http.method,
      protocol: event.requestContext.http.method,
      path: event.requestContext.http.path,
      requestTimeEpoch: event.requestContext.timeEpoch,
      resourcePath: event.requestContext.http.path,
      resourceId: event.requestContext.routeKey,
      authorizer: {},
      identity: {
        accessKey: null,
        accountId: null,
        apiKey: null,
        apiKeyId: null,
        caller: null,
        cognitoAuthenticationProvider: null,
        cognitoAuthenticationType: null,
        cognitoIdentityId: null,
        cognitoIdentityPoolId: null,
        principalOrgId: null,
        sourceIp: event.requestContext.http.sourceIp,
        user: null,
        userAgent: null,
        userArn: null,
      },
    },
    resource: event.routeKey,
  }
}

const handler = server.createHandler({
  cors: {
    origin: '*',
    credentials: true,
  },
})

exports.handler = (event: any, context: LambdaContext, callback: APIGatewayProxyCallback) => {
  return handler(marshallLambdaEvent(event), context, callback)
}
