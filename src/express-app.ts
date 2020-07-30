import cookieParser from 'cookie-parser'
import express from 'express'
import createServer from './apollo-server'
import {CORS_ALLOWED_ORIGINS} from './config/env'
import {ExpressApolloBundle} from './services/apollo'
import {generateOriginConfig} from './utils/http'

const initExpress = async (): Promise<ExpressApolloBundle> => {
  const app = express()

  app.use(cookieParser())

  const apolloServer = await createServer()

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

  return {
    apolloServer,
    app,
  }
}

export default initExpress
