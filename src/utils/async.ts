/**
 * This util essentially lets us store a promise but only have it start executing when it gets called.
 * Useful in the lambda context.
 */
export function deferPromiseCall<T>(promiseToResolve: () => Promise<T>): () => Promise<T> {
  let prom: Promise<T>

  return () => {
    if (!prom) {
      prom = promiseToResolve()
    }

    return prom
  }
}
