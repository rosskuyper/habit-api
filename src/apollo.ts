import express from 'express'
import {Config} from 'apollo-server'
import {buildSchema} from 'type-graphql'
import AuthResolver from './resolvers/AuthResolver'
import UserResolver from './resolvers/UserResolver'
import Bugsnag from './utils/bugsnag'
import {OUTPUT_ERRORS_TO_CONSOLE, PLAYGROUND_ENABLED} from './config'

export type Context = {
  req: express.Request
  res: express.Response
}

const playground = {
  settings: {
    'request.credentials': 'include',
  },
}

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
    playground: PLAYGROUND_ENABLED && playground,
    introspection: PLAYGROUND_ENABLED,

    // We need to define this to actually be given the items from express
    context: (context: Context): Context => context,

    // Error reporting happens here according to apollo
    formatError: (err) => {
      if (OUTPUT_ERRORS_TO_CONSOLE) {
        console.log(err)
      }

      Bugsnag.notify(err)
      return err
    },
  }
}
