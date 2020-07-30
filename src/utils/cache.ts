export type RememberFn<T> = (key: Key, valueFn: () => T) => T
export type Key = string | number

export type Cache<T> = {
  cache: Map<Key, T>
  remember: RememberFn<T>
  deleteItem: (key: string) => boolean
}

export const createCache = <T>(maxSize = 200): Cache<T> => {
  const cache = new Map<Key, T>()

  const remember: RememberFn<T> = (key, valueFn) => {
    // Check to see if we have a cache hit first
    if (cache.has(key)) {
      const cachedValue = cache.get(key)

      // Just to make TS happy without a not null assertion
      if (cachedValue) {
        return cachedValue
      }
    }

    const value = valueFn()

    cache.set(key, value)

    // limit the size of our cache
    if (cache.size > maxSize) {
      const keyToDelete = Array.from(cache.keys()).shift()

      if (keyToDelete) {
        cache.delete(keyToDelete)
      }
    }

    return value
  }

  const deleteItem = (key: string): boolean => {
    return cache.delete(key)
  }

  return {
    cache,
    remember,
    deleteItem,
  }
}
