import {Config} from 'apollo-server'
import resolvers from './resolvers'
import typeDefs from './schema'

export const serverConfig: Config = {
  typeDefs,
  resolvers,
}
