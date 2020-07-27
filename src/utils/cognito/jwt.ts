import jwt from 'jsonwebtoken'

export type CognitoIdentity = {
  userId: string
  providerName: 'Google'
  providerType: 'Google'
  issuer: null
  primary: 'true' | 'false'
  dateCreated: string
}

export type AccessToken = {
  sub: string
  username: string
  client_id: string
  token_use: 'access'
  scope: string
  auth_time: Date
  iss: string
  exp: Date
  iat: Date
  version: number
  jti: string
  'cognito:groups': string[]
}

export type IdToken = {
  sub: string
  email: string
  aud: string
  token_use: 'id'
  auth_time: Date
  iss: string
  exp: Date
  iat: Date
  at_hash: string
  identities: CognitoIdentity[]
  'cognito:username': string
  'cognito:groups': string[]
}

export class InvalidTokenError extends Error {}

export const decodeAccessToken = (accessToken: string): AccessToken => {
  const decodedToken = jwt.decode(accessToken)

  if (!decodedToken || typeof decodedToken === 'string') throw new InvalidTokenError('Token missing or malformed')
  if (!decodedToken.sub || typeof decodedToken.sub !== 'string') throw new InvalidTokenError('Invalid or missing sub')

  if (!decodedToken.token_use || decodedToken.token_use !== 'access')
    throw new InvalidTokenError('Invalid or missing token use')

  return {
    sub: decodedToken.sub,
    username: decodedToken.username,
    client_id: decodedToken.client_id,
    token_use: decodedToken.token_use,
    scope: decodedToken.scope,
    auth_time: new Date(decodedToken.auth_time * 1000),
    iss: decodedToken.iss,
    exp: new Date(decodedToken.exp * 1000),
    iat: new Date(decodedToken.iat * 1000),
    version: decodedToken.version,
    jti: decodedToken.jti,
    'cognito:groups': decodedToken['cognito:groups'],
  }
}

export const decodeIdToken = (idtoken: string): IdToken => {
  const decodedToken = jwt.decode(idtoken)

  if (!decodedToken || typeof decodedToken === 'string') throw new InvalidTokenError('Token missing or malformed')
  if (!decodedToken.sub || typeof decodedToken.sub !== 'string') throw new InvalidTokenError('Invalid or missing sub')

  if (!decodedToken.token_use || decodedToken.token_use !== 'id')
    throw new InvalidTokenError('Invalid or missing token use')

  return {
    sub: decodedToken.sub,
    email: decodedToken.email,
    aud: decodedToken.aud,
    token_use: decodedToken.token_use,
    auth_time: new Date(decodedToken.auth_time * 1000),
    iss: decodedToken.iss,
    exp: new Date(decodedToken.exp * 1000),
    iat: new Date(decodedToken.iat * 1000),
    at_hash: decodedToken.at_hash,
    identities: decodedToken.identities,
    'cognito:username': decodedToken['cognito:username'],
    'cognito:groups': decodedToken['cognito:groups'],
  }
}
