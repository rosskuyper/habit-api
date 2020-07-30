// Not exported from 'cors', annoyingly
export type CustomOrigin = (
  requestOrigin: string | undefined,
  callback: (err: Error | null, allow?: boolean) => void,
) => void

export const generateOriginConfig = (whitelist: string[]): string | CustomOrigin => {
  console.log('SetupCors', whitelist)

  if (whitelist.length === 1) {
    return whitelist[0]
  }

  const dynamicOrigin: CustomOrigin = (origin, callback) => {
    console.log('RequestCheck', origin, whitelist)

    // non-xhr requests and app requests will not have an origin - allow
    if (!origin) {
      callback(null, true)
    } else if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Invalid CORS Origin'))
    }
  }

  return dynamicOrigin
}
