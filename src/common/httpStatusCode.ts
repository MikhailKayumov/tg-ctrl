export enum HttpStatusCode {
  success = 200,
  accepted = 202,
  seeOther = 303,
  notModified = 304,
  badRequest = 400,
  unauthorized = 401,
  forbidden = 403,
  notFound = 404,
  timeout = 408,
  conflict = 409,
  requestedEntityTooLarge = 413,
  rangeNotSatisfiable = 416,
  unprocessableEntity = 422,
  enhanceYourCalm = 420,
  tooManyRequests = 429,
  exception = 500,
  notImplemented = 501,
  serviceUnavailable = 503,
}
