import express from 'express'
import {ApolloServer} from 'apollo-server-express'
import {serverConfig} from './apollo'
import {generateOriginConfig} from './utils/http'
import {CORS_ALLOWED_ORIGINS} from './config'

export type ExpressApolloBundle = {
  apolloServer: ApolloServer
  app: express.Express
}

const initExpress = async (): Promise<ExpressApolloBundle> => {
  const apolloConfig = await serverConfig()

  const app = express()
  const apolloServer = new ApolloServer(apolloConfig)

  apolloServer.applyMiddleware({
    app,
    cors: {
      origin: generateOriginConfig(CORS_ALLOWED_ORIGINS),
      credentials: true,
      methods: 'GET, POST',
      allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
    },
  })

  return {
    apolloServer,
    app,
  }
}

export default initExpress
