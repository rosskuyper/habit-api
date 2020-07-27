export type RememberFn<T> = (key: Key, valueFn: () => Promise<T>) => Promise<T>
export type Key = string | number

export type Cache<T> = {
  cache: Map<Key, T>
  remember: RememberFn<T>
}

export const createCache = <T>(): Cache<T> => {
  const cache: Map<Key, T> = new Map()

  const remember: RememberFn<T> = async (key, valueFn) => {
    // Check to see if we have a cache hit first
    if (cache.has(key)) {
      const cachedValue = cache.get(key)

      // Just to make TS happy without a not null assertion
      if (cachedValue) {
        return cachedValue
      }
    }

    const value = await valueFn()

    cache.set(key, value)

    // limit the size of our cache
    if (cache.size > 200) {
      let deleteCount = 0

      for (const key of cache.keys()) {
        if (deleteCount++ > 100) {
          break
        }

        cache.delete(key)
      }
    }

    return value
  }

  return {
    cache,
    remember,
  }
}
