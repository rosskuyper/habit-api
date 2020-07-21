/**
 * This setup starts an apollo server that directly handles incoming http requests.
 * A simple solution but as a caveat it means the lambda integration is bypassed.
 */

import 'reflect-metadata'
import {ApolloServer} from 'apollo-server'
import {serverConfig} from '../apollo'

const main = async () => {
  const config = await serverConfig()

  const server = new ApolloServer({
    ...config,
    playground: true,
    introspection: true,
  })

  server.listen(9000)

  console.log('Server is now listening at http://localhost:9000')
}

main()
