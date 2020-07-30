import env from 'env-var'

// env-var does not trim values pulled as arrays by default
const trim = (item: string) => item.trim()
const asRequiredTrimmedString = (key: string) => env.get(key).required().asString().trim()

export const NODE_ENV = asRequiredTrimmedString('NODE_ENV')
export const IS_LOCAL = NODE_ENV === 'local'

export const OUTPUT_ERRORS_TO_CONSOLE = env.get('OUTPUT_ERRORS_TO_CONSOLE').default('false').asBool()
export const PLAYGROUND_ENABLED = env.get('PLAYGROUND_ENABLED').default('false').asBool()

export const BUGSNAG_API_KEY = asRequiredTrimmedString('BUGSNAG_API_KEY')

export const DDB_PRIMARY_TABLE = asRequiredTrimmedString('DDB_PRIMARY_TABLE')

export const AUTH_COGNITO_USER_POOL_ID = asRequiredTrimmedString('AUTH_COGNITO_USER_POOL_ID')
export const AUTH_COGNITO_USER_POOL_REGION = asRequiredTrimmedString('AUTH_COGNITO_USER_POOL_REGION')
export const AUTH_COGNITO_CLIENT_ID = asRequiredTrimmedString('AUTH_COGNITO_CLIENT_ID')
export const AUTH_COGNITO_CLIENT_SECRET = asRequiredTrimmedString('AUTH_COGNITO_CLIENT_SECRET')
export const AUTH_COGNITO_AUTHORIZE_DOMAIN = asRequiredTrimmedString('AUTH_COGNITO_AUTHORIZE_DOMAIN')
export const AUTH_COGNITO_REDIRECT_URI = asRequiredTrimmedString('AUTH_COGNITO_REDIRECT_URI')

export const CORS_ALLOWED_ORIGINS = env.get('CORS_ALLOWED_ORIGINS').required().asArray().map(trim)
