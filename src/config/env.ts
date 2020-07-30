import env from 'env-var'

// env-var does not trim values pulled as arrays by default
const trim = (item: string) => item.trim()

export const NODE_ENV = env.get('NODE_ENV').required().asString()
export const IS_LOCAL = NODE_ENV === 'local'

export const OUTPUT_ERRORS_TO_CONSOLE = env.get('OUTPUT_ERRORS_TO_CONSOLE').default('false').asBool()
export const PLAYGROUND_ENABLED = env.get('PLAYGROUND_ENABLED').default('false').asBool()

export const BUGSNAG_API_KEY = env.get('BUGSNAG_API_KEY').required().asString()

export const DDB_PRIMARY_TABLE = env.get('DDB_PRIMARY_TABLE').required().asString()

export const AUTH_COGNITO_USER_POOL_ID = env.get('AUTH_COGNITO_USER_POOL_ID').required().asString()
export const AUTH_COGNITO_USER_POOL_REGION = env.get('AUTH_COGNITO_USER_POOL_REGION').required().asString()
export const AUTH_COGNITO_CLIENT_ID = env.get('AUTH_COGNITO_CLIENT_ID').required().asString()
export const AUTH_COGNITO_CLIENT_SECRET = env.get('AUTH_COGNITO_CLIENT_SECRET').required().asString()
export const AUTH_COGNITO_AUTHORIZE_DOMAIN = env.get('AUTH_COGNITO_AUTHORIZE_DOMAIN').required().asString()
export const AUTH_COGNITO_REDIRECT_URI = env.get('AUTH_COGNITO_REDIRECT_URI').required().asString()

export const CORS_ALLOWED_ORIGINS = env.get('CORS_ALLOWED_ORIGINS').required().asArray().map(trim)
