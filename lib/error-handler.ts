import { NextResponse } from 'next/server';
import { createServiceLogger } from './logger';

const logger = createServiceLogger('error-handler');

interface ErrorResponseOptions {
  status?: number;
  code?: string;
  details?: unknown;
  log?: boolean;
}

/**
 * Standardized API error response creator
 * @param message User-friendly error message
 * @param options Error configuration options
 */
export function createErrorResponse(
  message: string, 
  options: ErrorResponseOptions = {}
) {
  const { 
    status = 500, 
    code = 'server_error',
    details = null,
    log = true
  } = options;
  
  if (log) {
    logger.error(`${code} (${status}): ${message}`, details || '');
  }
  
  return NextResponse.json(
    { 
      error: {
        message,
        code,
        ...(details ? { details } : {})
      }
    },
    { status }
  );
}

/**
 * Error handler for client components with toast notifications
 * @param error The error object 
 * @param toast Toast function from useToast
 * @param customMessage Optional override message
 */
export function handleClientError(
  error: unknown, 
  toast: (options: { variant: string; title: string; description: string }) => void, 
  customMessage?: string
) {
  console.error('Client error:', error);
  
  let errorMessage = customMessage || 'An unexpected error occurred';
  let errorTitle = 'Error';
  
  if (error instanceof Response) {
    errorTitle = `Error ${error.status}`;
    try {
      // Try to parse response error
      error.json().then(data => {
        if (data?.error?.message) {
          errorMessage = data.error.message;
        }
      });
    } catch {
      // If parsing fails, use status text
      errorMessage = error.statusText || errorMessage;
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }
  
  toast({
    variant: 'destructive',
    title: errorTitle,
    description: errorMessage
  });
  
  return { message: errorMessage };
} 