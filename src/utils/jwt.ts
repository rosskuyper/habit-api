import jwt, {Algorithm} from 'jsonwebtoken'
import fetch from 'node-fetch'
import jwkToPem, {JWK} from 'jwk-to-pem'
import {createCache} from './cache'

/********************************
 * Types
 ********************************/
export type JwtHeader = {
  kid: string
  alg: string
}

type CognitoPubkey = JWK & {
  kid: string
}

type CognitoPubkeySet = {
  keys: CognitoPubkey[]
}

type CognitoPubkeyMap = Record<string, string>

export type CognitoIdentity = {
  userId: string
  providerName: 'Google'
  providerType: 'Google'
  issuer: null
  primary: 'true' | 'false'
  dateCreated: string
}

type BaseToken = {
  sub: string
  iss: string
  exp: number
  iat: number
  auth_time: number
  'cognito:groups': string[]
}

export type AccessToken = BaseToken & {
  token_use: 'access'
  username: string
  client_id: string
  scope: string
  version: number
  jti: string
}

export type IdToken = BaseToken & {
  token_use: 'id'
  email: string
  family_name: string
  given_name: string
  nonce: string
  aud: string
  at_hash: string
  identities: CognitoIdentity[]
  'cognito:username': string
}

export type RawTokenSet = {
  accessToken: string
  refreshToken: string
  idToken: string
}

type Token = AccessToken | IdToken

export type TokenWithHeader<TokenType = Token> = {
  payload: TokenType
  header: JwtHeader
}

export type DecodedTokenSet = {
  accessToken: AccessToken
  idToken: IdToken
  original: RawTokenSet
}

export type VerifyTokenOpts = {
  authorizedIssuers: string[]
  authorizedAudiences: string[]
}

/********************************
 * Utils
 ********************************/

const {remember: rememberPubkey} = createCache<Promise<CognitoPubkeyMap>>()

const fetchPubkeys = async (iss: string): Promise<CognitoPubkeyMap> => {
  const res = await fetch(`${iss}/.well-known/jwks.json`)

  if (!res.ok) {
    throw new Error(await res.text())
  }

  const keySet: CognitoPubkeySet = await res.json()

  return keySet.keys.reduce((acc, key) => {
    acc[key.kid] = jwkToPem(key)
    return acc
  }, {} as CognitoPubkeyMap)
}

const decodeToken = <T = Token>(token: string): {header: JwtHeader; payload: T} => {
  const decodeResult = jwt.decode(token, {complete: true})

  if (!decodeResult || typeof decodeResult === 'string' || !decodeResult.header || !decodeResult.payload) {
    throw new Error('Failed to decode token')
  }

  return {
    header: decodeResult.header,
    payload: decodeResult.payload,
  }
}

const verifyTokenSignature = async <T = Token>(token: TokenWithHeader, tokenString: string): Promise<T> => {
  const {
    header: {kid, alg},
    payload: {iss},
  } = token

  const keySet = await rememberPubkey(iss, () => fetchPubkeys(iss))
  const pem = keySet[token.header.kid]

  if (!pem) {
    throw new Error(`No pubkey found for ${kid}`)
  }

  return new Promise((resolve, reject) => {
    jwt.verify(tokenString, pem, {algorithms: [alg as Algorithm]}, (err, decoded) => {
      if (err) {
        return reject(err)
      }

      resolve((decoded as unknown) as T)
    })
  })
}

/********************************
 * Module Functions
 ********************************/

export const verifyToken = async <T = Token>(
  tokenString: string,
  opts: VerifyTokenOpts,
  tokenUse: T extends AccessToken ? 'access' : 'id',
): Promise<T> => {
  const token = decodeToken<Token>(tokenString)

  if (token.payload.token_use !== tokenUse) {
    throw new Error('Invalid token use')
  }

  const audience = token.payload.token_use === 'id' ? token.payload.aud : token.payload.client_id

  const validIssuer = opts.authorizedIssuers.includes(token.payload.iss)
  const validAudience = opts.authorizedAudiences.includes(audience)

  if (!validIssuer || !validAudience) {
    throw new Error('Invalid token audience or issuer')
  }

  return verifyTokenSignature<T>(token, tokenString)
}

export const verifyTokenSet = async (tokenSet: RawTokenSet, opts: VerifyTokenOpts): Promise<DecodedTokenSet> => {
  return {
    accessToken: await verifyToken<AccessToken>(tokenSet.accessToken, opts, 'access'),
    idToken: await verifyToken<IdToken>(tokenSet.idToken, opts, 'id'),
    original: tokenSet,
  }
}
