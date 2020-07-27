import fetch from 'node-fetch'
import queryString from 'query-string'
import {AUTH_COGNITO_CLIENT_SECRET} from '../../config'
import {storeTokenSet} from '../../mappers/TokenMapper'
import {providers} from './providers'
import TokenSet from '../../models/TokenSetModel'
import {verifyTokenResult} from '../auth'

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

  return await storeTokenSet(tokenSet)
}
