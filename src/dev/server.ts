/**
 * This setup starts an apollo server that directly handles incoming http requests.
 * A simple solution but as a caveat it means the lambda integration is bypassed.
 */

import {ApolloServer} from 'apollo-server'
import {serverConfig} from '../apollo'

const server = new ApolloServer({
  ...serverConfig,
  playground: true,
  introspection: true,
})

server.listen(9000)

console.log('Server is now listening at http://localhost:9000')
