const { ApolloServer, gql } = require('apollo-server-lambda');
const queryString = require('query-string')

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};

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
});

const parseMultiValueHeaders = (headers) => {
    const headerPairs = Object.keys(headers).map((headerKey) => {
        return [headerKey, headers[headerKey]]
    })

    return Object.fromEntries(headerPairs)
}

const ensureSingleQueryParams = (parsedQueryParams) => {
    const queryPairs = Object.keys(parsedQueryParams).map((paramKey) => {
        const param = parsedQueryParams[paramKey]

        return [
            paramKey,
            Array.isArray(param) ? param[0] : param,
        ]
    })

    return Object.fromEntries(queryPairs)
}

const ensureMultiQueryParams = (parsedQueryParams) => {
    const queryPairs = Object.keys(parsedQueryParams).map((paramKey) => {
        const param = parsedQueryParams[paramKey]

        return [
            paramKey,
            Array.isArray(param) ? param : [param],
        ]
    })

    return Object.fromEntries(queryPairs)
}

const marshallLambdaEvent = (event) => {
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
        requestContext: event.requestContext,
        resource: event.routeKey,
    }
}

const handler = server.createHandler();

exports.handler = (event, context, callback) => {
    return handler(marshallLambdaEvent(event), context, callback)
}
