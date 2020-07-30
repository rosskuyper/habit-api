import {
  AUTH_COGNITO_AUTHORIZE_DOMAIN,
  AUTH_COGNITO_CLIENT_ID,
  AUTH_COGNITO_CLIENT_SECRET,
  AUTH_COGNITO_REDIRECT_URI,
  AUTH_COGNITO_USER_POOL_REGION,
  AUTH_COGNITO_USER_POOL_ID,
} from './env'

const COGNITO_ISS = `https://cognito-idp.${AUTH_COGNITO_USER_POOL_REGION}.amazonaws.com/${AUTH_COGNITO_USER_POOL_ID}`

export type IdentityProvider = {
  authorizeUri: string
  tokenUri: string
  clientId: string
  redirectUri: string
  responseType: string
  scope: string
  identityProvider: string
  issuer: string
}

export type IdentityProviderSecrets = {
  clientSecret: string
}

export const providers: {[key: string]: IdentityProvider} = {
  [AUTH_COGNITO_CLIENT_ID]: {
    identityProvider: 'Google',
    responseType: 'code',
    scope: 'openid email phone profile',
    clientId: AUTH_COGNITO_CLIENT_ID,
    redirectUri: AUTH_COGNITO_REDIRECT_URI,
    authorizeUri: `https://${AUTH_COGNITO_AUTHORIZE_DOMAIN}/oauth2/authorize`,
    tokenUri: `https://${AUTH_COGNITO_AUTHORIZE_DOMAIN}/oauth2/token`,
    issuer: COGNITO_ISS,
  },
}

export const providerSecrets: {[key: string]: IdentityProviderSecrets} = {
  [AUTH_COGNITO_CLIENT_ID]: {
    clientSecret: AUTH_COGNITO_CLIENT_SECRET,
  },
}

export const getProvider = (clientId: string): {provider: IdentityProvider; secrets: IdentityProviderSecrets} => {
  if (!providers[clientId] || !providerSecrets[clientId]) {
    throw new Error('Invalid clientId')
  }

  return {
    provider: providers[clientId],
    secrets: providerSecrets[clientId],
  }
}

export const authorizedIssuers = [
  `https://cognito-idp.${AUTH_COGNITO_USER_POOL_REGION}.amazonaws.com/${AUTH_COGNITO_USER_POOL_ID}`,
]

export const authorizedClientIds = [
  //
  AUTH_COGNITO_CLIENT_ID,
]
