import {Config} from 'apollo-server-lambda'
import {buildSchema} from 'type-graphql'
import Bugsnag from './utils/bugsnag'

import UserResolver from './resolvers/UserResolver'

export const serverConfig = async (): Promise<Config> => {
  const schema = await buildSchema({
    resolvers: [
      //
      UserResolver,
    ],
  })

  return {
    schema,
    formatError: (err) => {
      Bugsnag.notify(err)
      return err
    },
  }
}
