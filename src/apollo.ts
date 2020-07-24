import {Config} from 'apollo-server-lambda'
import {buildSchema} from 'type-graphql'
import AuthResolver from './resolvers/AuthResolver'
import UserResolver from './resolvers/UserResolver'
import Bugsnag from './utils/bugsnag'

export const serverConfig = async (): Promise<Config> => {
  const schema = await buildSchema({
    resolvers: [
      //
      UserResolver,
      AuthResolver,
    ],
  })

  return {
    schema,
    context: async (context) => {
      console.log('setup', Object.keys(context))

      return context
    },
    formatError: (err) => {
      Bugsnag.notify(err)
      return err
    },
  }
}
