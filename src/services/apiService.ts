import { create, ApisauceConfig, ApiResponse } from 'apisauce';
import Utils from '../utility/Utils';
import { CONTENT_TYPE, HTTP_STATUS } from './api';
import { useAuthStore } from '@/store/useAuthStore';
import { BASE_URL_DEV} from '@env';

const BASE_URL = BASE_URL_DEV;

// Create API instance
const apiSauceInstance = create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 second timeout
});

// Types for better type safety
interface ApiError {
  code: number;
  message: string;
  errorCode: number;
}

interface ApiResult<T = any> {
  ok: boolean;
  status: number | undefined;
  response: ApiError;
  data: T | null;
}

/**
 * Main GET request
 */
async function get<T = any>(
  url: string,
  queryParams?: Record<string, any>,
  config?: Partial<ApisauceConfig>
): Promise<ApiResult<T>> {
  try {
    const response = await apiSauceInstance.get<T>(url, queryParams, config);
    return handleResponse<T>(response);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * POST request
 */
async function post<T = any>(
  url: string,
  data: any,
  config: Partial<ApisauceConfig> = {}
): Promise<ApiResult<T>> {
  try {
    const response = await apiSauceInstance.post<T>(url, data, config);
    return handleResponse<T>(response);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * PUT request
 */
async function put<T = any>(
  url: string,
  data: Record<string, any>,
  config?: Partial<ApisauceConfig>
): Promise<ApiResult<T>> {
  try {
    const response = await apiSauceInstance.put<T>(url, data, config);
    return handleResponse<T>(response);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * PATCH request
 */
async function patch<T = any>(
  url: string,
  data: Record<string, any>,
  config?: Partial<ApisauceConfig>
): Promise<ApiResult<T>> {
  try {
    const response = await apiSauceInstance.patch<T>(url, data, config);
    return handleResponse<T>(response);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * DELETE request
 */
async function deleteReq<T = any>(
  url: string,
  queryParams?: Record<string, any>,
  config?: Partial<ApisauceConfig>
): Promise<ApiResult<T>> {
  try {
    const response = await apiSauceInstance.delete<T>(url, queryParams, config);
    return handleResponse<T>(response);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Handles all API responses with proper error handling
 */
function handleResponse<T = any>(response: ApiResponse<any>): ApiResult<T> {
  const fullResponseData = response.data ?? {};

  const mutatedResponse: ApiResult<T> = {
    ok: response.ok,
    status: response.status,
    response: {
      code: Utils.getValue(fullResponseData, 'response.code', HTTP_STATUS.SERVER_ERROR),
      message: Utils.getValue(fullResponseData, 'message', 'Something went wrong'),
      errorCode: Utils.getValue(fullResponseData, 'response.errorCode', HTTP_STATUS.BAD_REQUEST),
    },
    data: null,
  };

  // UNAUTHORIZED - Clear auth and redirect
  if (response.status === HTTP_STATUS.UNAUTHORIZED) {
    try {
      useAuthStore.getState().logout();
    } catch (error) {
      console.error('Error during logout:', error);
    }
    return mutatedResponse;
  }

  // SERVER ERROR
  if (response.status === HTTP_STATUS.SERVER_ERROR) {
    return mutatedResponse;
  }

  // NO RESPONSE (Network error)
  if (!response.ok && !response.status) {
    return {
      ...mutatedResponse,
      response: {
        ...mutatedResponse.response,
        message: 'Network error. Please check your connection.',
      },
    };
  }

  // SUCCESS
  if (response.ok) {
    return {
      ...mutatedResponse,
      data: fullResponseData,
    };
  }

  // ALL OTHER FAILURES
  return {
    ...mutatedResponse,
    data: fullResponseData,
  };
}

/**
 * Handles unexpected errors (network failures, exceptions)
 */
function handleError(error: any): ApiResult {
  console.error('API Error:', error);
  
  return {
    ok: false,
    status: undefined,
    response: {
      code: HTTP_STATUS.SERVER_ERROR,
      message: error?.message || 'An unexpected error occurred',
      errorCode: HTTP_STATUS.SERVER_ERROR,
    },
    data: null,
  };
}

/**
 * Inject headers in all requests with proper error handling
 */
apiSauceInstance.addRequestTransform((request) => {
  try {
    const token = useAuthStore.getState()?.token;
    
    // Initialize headers if not present
    request.headers = request.headers || {};
    
    // Add Authorization header if token exists
    if (token) {
      request.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Only set JSON header if body is not FormData
    if (!(request.data instanceof FormData)) {
      request.headers['Content-Type'] = CONTENT_TYPE.JSON;
    } else {
      // Remove Content-Type for FormData (browser will set it with boundary)
      delete request.headers['Content-Type'];
    }
  } catch (error) {
    console.error('Error in request transform:', error);
  }
});

/**
 * Response interceptor for logging (optional, remove in production)
 */
if (__DEV__) {
  apiSauceInstance.addResponseTransform((response) => {
    console.log('API Response:', {
      url: response.config?.url,
      status: response.status,
      ok: response.ok,
    });
  });
}

export default {
  get,
  post,
  patch,
  put,
  delete: deleteReq,
};