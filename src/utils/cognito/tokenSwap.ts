import jwt from 'jsonwebtoken'
import fetch from 'node-fetch'
import queryString from 'query-string'
import {AUTH_COGNITO_CLIENT_SECRET} from '../../config'
import {storeTokenSet} from '../../mappers/AuthMapper'
import {providers} from './providers'

export type TokenSet = {
  accessToken: string
  refreshToken: string
  idToken: string
}

function verifyTokenResult(result: {access_token: string; refresh_token: string; id_token: string}) {
  if (!result) {
    throw new Error('Empty Cognito token payload')
  }

  const {access_token: accessToken, refresh_token: refreshToken, id_token: idToken} = result

  if (!accessToken || !refreshToken || !idToken) {
    throw new Error('Invalid Cognito token payload')
  }

  const parsedIdToken = jwt.decode(idToken)

  if (!parsedIdToken) {
    throw new Error('Error decoding token payload.')
  }

  return {
    accessToken,
    refreshToken,
    idToken,
  }
}

export const swapCodeForTokens = async (code: string, clientId: string): Promise<TokenSet> => {
  const provider = providers.find((provider) => provider.clientId === clientId)

  if (!provider) {
    throw new Error('Invalid clientId')
  }

  const authHeader = Buffer.from(`${clientId}:${AUTH_COGNITO_CLIENT_SECRET}`, 'utf8').toString('base64')

  const response = await fetch(provider.tokenUri, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${authHeader}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: queryString.stringify({
      grant_type: 'authorization_code',
      redirect_uri: provider.redirectUri,
      code,
    }),
  })

  const responseBody = await response.json()

  if (!response.ok) {
    throw new Error(responseBody.error)
  }

  const tokenSet = verifyTokenResult(responseBody)

  await storeTokenSet(tokenSet)

  return tokenSet
}
