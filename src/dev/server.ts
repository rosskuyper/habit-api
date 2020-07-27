/**
 * This setup starts an apollo server that directly handles incoming http requests.
 * A simple solution but as a caveat it means the lambda integration is bypassed.
 */

import 'reflect-metadata'
import initExpress from '../app'

const main = async () => {
  const {app, apolloServer} = await initExpress()

  app.listen({port: 9000}, () => console.log(`🚀 Server ready at http://localhost:9000${apolloServer.graphqlPath}`))
}

main()
