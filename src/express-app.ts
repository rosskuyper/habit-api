import cookieParser from 'cookie-parser'
import express from 'express'
import createServer from './apollo-server'
import {CORS_ALLOWED_ORIGINS} from './config/env'
import {ExpressApolloBundle} from './services/apollo'
import {generateOriginConfig} from './utils/http'

/**
 * This sets up our express app and configures the apollo server
 * to work with it, returning both.
 *
 * HTTP <-> App config (cookies, headers, etc) should generally be handled here.
 * Apollo / GraphQL config should be handled within the apollo-server module.
 */
const initExpress = async (): Promise<ExpressApolloBundle> => {
  // Create our app
  const app = express()

  // We use cookies for auth from web clients, so we'll need to parse those.
  app.use(cookieParser())

  // The apollo server. Resovlers, schemas, etc are set up within `createServer`
  const apolloServer = await createServer()

  // Apollo applies itself as middleware to the express app.
  // The CORS config here only applies to requests handled by apollo.
  apolloServer.applyMiddleware({
    app,
    cors: {
      origin: generateOriginConfig(CORS_ALLOWED_ORIGINS),
      credentials: true,
      methods: 'GET, POST',
      allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
      maxAge: 84600,
    },
  })

  // Send both back in case they're needed.
  return {
    apolloServer,
    app,
  }
}

export default initExpress
