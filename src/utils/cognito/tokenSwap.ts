import fetch from 'node-fetch'
import queryString from 'query-string'
import {RawTokenSet} from './jwt'

export type OAuthOptions = {
  clientId: string
  clientSecret: string
  tokenUri: string
  redirectUri: string
}

export const swapCodeForTokens = async (code: string, opts: OAuthOptions): Promise<RawTokenSet> => {
  const authHeader = Buffer.from(`${opts.clientId}:${opts.clientSecret}`, 'utf8').toString('base64')

  const response = await fetch(opts.tokenUri, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${authHeader}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: queryString.stringify({
      grant_type: 'authorization_code',
      redirect_uri: opts.redirectUri,
      code,
    }),
  })

  const responseBody = await response.json()

  if (!response.ok) {
    throw new Error(responseBody.error)
  }

  const {access_token: accessToken, refresh_token: refreshToken, id_token: idToken} = responseBody

  if (!accessToken || !refreshToken || !idToken) {
    throw new Error('Invalid Cognito token payload')
  }

  return {
    accessToken,
    refreshToken,
    idToken,
  }
}
