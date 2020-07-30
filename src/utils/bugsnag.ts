import Bugsnag from '@bugsnag/js'
import {BUGSNAG_API_KEY} from '../config/env'

Bugsnag.start({
  apiKey: BUGSNAG_API_KEY,
})

export default Bugsnag
