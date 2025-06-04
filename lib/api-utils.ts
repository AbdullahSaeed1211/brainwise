import { NextResponse } from "next/server";

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export function successResponse<T>(data: T, message = "Success"): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    message,
  }, { status: 200 });
}

export function createdResponse<T>(data: T, message = "Resource created successfully"): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    message,
  }, { status: 201 });
}

export function notFoundResponse(message = "Resource not found"): NextResponse<ApiResponse<null>> {
  return NextResponse.json({
    success: false,
    error: message,
  }, { status: 404 });
}

export function badRequestResponse(message = "Bad request"): NextResponse<ApiResponse<null>> {
  return NextResponse.json({
    success: false,
    error: message,
  }, { status: 400 });
}

export function unauthorizedResponse(message = "Unauthorized"): NextResponse<ApiResponse<null>> {
  return NextResponse.json({
    success: false,
    error: message,
  }, { status: 401 });
}

export function forbiddenResponse(message = "Forbidden"): NextResponse<ApiResponse<null>> {
  return NextResponse.json({
    success: false,
    error: message,
  }, { status: 403 });
}

export function serverErrorResponse(message = "Internal server error"): NextResponse<ApiResponse<null>> {
  return NextResponse.json({
    success: false,
    error: message,
  }, { status: 500 });
}

export function handleApiError(error: unknown): NextResponse<ApiResponse<null>> {
  console.error("API Error:", error);
  
  if (error instanceof Error) {
    return serverErrorResponse(error.message);
  }
  
  return serverErrorResponse();
} 