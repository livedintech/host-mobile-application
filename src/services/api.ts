import { QueryClient } from "@tanstack/react-query"

export const API_CONFIG = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  PATCH: 'patch',
  BASE_URL_QA: '',
  DELETE: 'delete',
}

export const CONTENT_TYPE = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
}

export const HTTP_STATUS = {
  // Success
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  
  // Client Errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  PAYLOAD_TOO_LARGE: 413,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  
  // Server Errors
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  
  // Legacy aliases (for backward compatibility)
  SERVER_ERROR: 500,
}

export const PAGE_SIZE = 10

export const STALE_TIME = 60 * 1000

export const CACHE_TIME = 1000 * 60 * 60 * 24


export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME,
      gcTime: CACHE_TIME,
    },
    mutations: {
      onError: e => {
        console.log('api mutation error ', e)
      },
    },
  },
})