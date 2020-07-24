import {AUTH_COGNITO_AUTHORIZE_DOMAIN, AUTH_COGNITO_CLIENT_ID, AUTH_COGNITO_REDIRECT_URI} from '../../config'

export type IdentityProvider = {
  authorizeUri: string
  tokenUri: string
  clientId: string
  redirectUri: string
  responseType: string
  scope: string
  identityProvider: string
}

export const providers: IdentityProvider[] = [
  {
    identityProvider: 'Google',
    responseType: 'code',
    scope: 'openid email phone profile',
    clientId: AUTH_COGNITO_CLIENT_ID,
    redirectUri: AUTH_COGNITO_REDIRECT_URI,
    authorizeUri: `https://${AUTH_COGNITO_AUTHORIZE_DOMAIN}/oauth2/authorize`,
    tokenUri: `https://${AUTH_COGNITO_AUTHORIZE_DOMAIN}/oauth2/token`,
  },
]
