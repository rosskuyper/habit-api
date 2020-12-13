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

export const CORS_ALLOWED_ORIGINS = env.get('CORS_ALLOWED_ORIGINS').required().asArray().map(trim)

export const FIREBASE_PROJECT_ID = env.get('FIREBASE_PROJECT_ID').required().asString().trim()
export const FIREBASE_PRIVATE_KEY = env.get('FIREBASE_PRIVATE_KEY').required().asString().replace(/\\n/g, '\n')
export const FIREBASE_CLIENT_EMAIL = env.get('FIREBASE_CLIENT_EMAIL').required().asString().trim()
