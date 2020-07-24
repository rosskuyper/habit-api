import env from 'env-var'

export const BUGSNAG_API_KEY = env.get('BUGSNAG_API_KEY').required().asString()

export const DDB_HABITS_TABLE = env.get('DDB_HABITS_TABLE').required().asString()
export const DDB_AUTH_TABLE = env.get('DDB_AUTH_TABLE').required().asString()

export const AUTH_COGNITO_CLIENT_ID = env.get('AUTH_COGNITO_CLIENT_ID').required().asString()
export const AUTH_COGNITO_CLIENT_SECRET = env.get('AUTH_COGNITO_CLIENT_SECRET').required().asString()
export const AUTH_COGNITO_AUTHORIZE_DOMAIN = env.get('AUTH_COGNITO_AUTHORIZE_DOMAIN').required().asString()
export const AUTH_COGNITO_REDIRECT_URI = env.get('AUTH_COGNITO_REDIRECT_URI').required().asString()
