/**
 * The simple and convenient setup of api gateway <-> lambda via terraform for their HTTP / WebSocket
 * integration uses a new event payload format.
 *
 * The apollo lambda integration does not seem to support this payload yet, so here we marshall / convert
 * it to the older format.
 *
 * This is not ideal, but because the bulk of GQL request handling is dependent on the request body it's
 * unlikely that any issues will be caused by this.
 *
 * For a proper production environment it would be better to get the support for the new payload version
 * into apollo.
 */
import queryString, {ParsedQuery} from 'query-string'
import {APIGatewayProxyEvent, APIGatewayProxyEventV2} from 'aws-lambda'

type SingleDimensionObject = {[name: string]: string}
type TwoDimensionObject = {[name: string]: string[]}

// Convert 1D headers into a 2D array
const parseMultiValueHeaders = (headers: SingleDimensionObject): TwoDimensionObject => {
  const headerPairs = Object.keys(headers).map((headerKey) => {
    return [headerKey, [headers[headerKey]]]
  })

  return Object.fromEntries(headerPairs)
}

const parseQueryParams = (parsedQueryParams: ParsedQuery<string>): ParsedQueryParams => {
  const queryStringParameters: SingleDimensionObject = {}
  const multiValueQueryStringParameters: TwoDimensionObject = {}

  Object.keys(parsedQueryParams).forEach((paramKey) => {
    const param = parsedQueryParams[paramKey]

    // Filter out null and undefined values which queryString.parse might give us
    if (param === undefined || param === null) {
      return
    }

    // Add the dimension-adjusted value to both objects
    if (Array.isArray(param)) {
      queryStringParameters[paramKey] = param.join(',')
      multiValueQueryStringParameters[paramKey] = param
    } else {
      queryStringParameters[paramKey] = param
      multiValueQueryStringParameters[paramKey] = [param]
    }
  })

  return {
    queryStringParameters,
    multiValueQueryStringParameters,
  }
}

type ParsedQueryParams = {
  queryStringParameters: SingleDimensionObject | null
  multiValueQueryStringParameters: TwoDimensionObject | null
}

const parseRawQueryString = (rawQueryString: string): ParsedQueryParams => {
  const parsedQueryParams = queryString.parse(rawQueryString)

  if (!parsedQueryParams) {
    return {
      queryStringParameters: null,
      multiValueQueryStringParameters: null,
    }
  }

  return parseQueryParams(parsedQueryParams)
}

export const marshallLambdaEvent = (event: APIGatewayProxyEventV2): APIGatewayProxyEvent => {
  const {queryStringParameters, multiValueQueryStringParameters} = parseRawQueryString(event.rawQueryString)

  const headers = {...event.headers}

  if (event.cookies) {
    headers.cookie = event.cookies.join('; ')
  }

  return {
    body: event.body || null,
    headers,
    multiValueHeaders: parseMultiValueHeaders(event.headers),
    httpMethod: event.requestContext.http.method,
    isBase64Encoded: event.isBase64Encoded,
    path: event.requestContext.http.path,
    pathParameters: null,
    queryStringParameters,
    multiValueQueryStringParameters,
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
