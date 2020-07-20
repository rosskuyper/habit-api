import env from 'env-var'

export const BUGSNAG_API_KEY = env.get('BUGSNAG_API_KEY').required().asString()
