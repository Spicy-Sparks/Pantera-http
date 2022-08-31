export const errorToObject = (
  error: Error
): {
  [key: string]: any
} => {

  const keys = Object.getOwnPropertyNames(error)

  return Object.fromEntries((keys.map((errorKey) => [
    errorKey,
    error[errorKey]
  ])))
}
