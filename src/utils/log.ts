import Bugsnag from './bugsnag'
import {OUTPUT_ERRORS_TO_CONSOLE} from '../config'

export const logHandledError = (error: Error): void => {
  if (OUTPUT_ERRORS_TO_CONSOLE) {
    console.log(error)
  }

  Bugsnag.notify(error)
}
