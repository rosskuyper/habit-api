import {Config} from 'apollo-server-lambda'
import resolvers from './resolvers'
import typeDefs from './schema'
import Bugsnag from './utils/bugsnag'

export const serverConfig: Config = {
  typeDefs,
  resolvers,
  formatError: (err) => {
    Bugsnag.notify(err)
    return err
  },
}
