import {IS_LOCAL} from './env'

type BaseCookieOpts = {
  httpOnly: true
  sameSite: 'strict'
  secure: boolean
}

type CookieOpts = BaseCookieOpts & {
  maxAge: number
}

export const baseCookieOpts: BaseCookieOpts = {
  httpOnly: true,
  sameSite: 'strict',
  secure: !IS_LOCAL,
}

export const setCookieConfig = (): CookieOpts => ({
  ...baseCookieOpts,
  maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days (token expires earlier but can be refreshed)
})
