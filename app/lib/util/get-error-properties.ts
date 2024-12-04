export function getErrorProperties(e: unknown): { [key: string]: any } {
  let error: { [key: string]: any } = {}

  if (e instanceof Error) {
    error = Object.fromEntries(
      Object.getOwnPropertyNames(e).map(key => [key, (e as any)[key]])
    )
  } else {
    error.message = String(e)
  }

  return error
}
