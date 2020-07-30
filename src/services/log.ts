import Bugsnag from './bugsnag'
import {OUTPUT_ERRORS_TO_CONSOLE} from '../config/env'
import {GraphQLError} from 'graphql'

export const logHandledError = (error: Error): void => {
  if (OUTPUT_ERRORS_TO_CONSOLE) {
    if (error instanceof GraphQLError) {
      console.log(`GraphQLError: ${error.message}`)
      console.log(error?.extensions?.exception?.stacktrace)
    } else {
      console.log(error)
    }
  }

  Bugsnag.notify(error)
}
