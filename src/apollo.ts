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
    playground: true,
    introspection: true,
    context: async (context) => {
      console.log('setup', Object.keys(context))
      console.log('setup', context)

      return context
    },
    formatError: (err) => {
      Bugsnag.notify(err)
      return err
    },
  }
}
