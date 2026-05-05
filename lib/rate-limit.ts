/**
 * Rate Limiting Utility for API Routes
 * Prevents brute force attacks and API abuse
 */

import { NextRequest, NextResponse } from "next/server";

interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests allowed in the interval
}

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting
// In production, use Redis for distributed rate limiting
const rateLimitStore = new Map<string, RateLimitRecord>();

/**
 * Get client identifier (IP address)
 */
function getClientId(request: NextRequest): string {
  // Try to get real IP from headers (for proxies/load balancers)
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  // Fallback to connection IP
  return request.ip || "unknown";
}

/**
 * Check if request should be rate limited
 */
export function checkRateLimit(
  request: NextRequest,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetTime: number } {
  const clientId = getClientId(request);
  const now = Date.now();
  
  // Get or create rate limit record
  let record = rateLimitStore.get(clientId);
  
  // Reset if interval has passed
  if (!record || now > record.resetTime) {
    record = {
      count: 0,
      resetTime: now + config.interval,
    };
    rateLimitStore.set(clientId, record);
  }
  
  // Check if limit exceeded
  if (record.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }
  
  // Increment count
  record.count++;
  
  return {
    allowed: true,
    remaining: config.maxRequests - record.count,
    resetTime: record.resetTime,
  };
}

/**
 * Rate limit middleware wrapper for API routes
 */
export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>,
  config: RateLimitConfig
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const { allowed, remaining, resetTime } = checkRateLimit(request, config);
    
    // Add rate limit headers
    const headers = {
      "X-RateLimit-Limit": config.maxRequests.toString(),
      "X-RateLimit-Remaining": remaining.toString(),
      "X-RateLimit-Reset": new Date(resetTime).toISOString(),
    };
    
    if (!allowed) {
      const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
      
      return NextResponse.json(
        {
          error: "Too many requests",
          message: `Rate limit exceeded. Please try again in ${retryAfter} seconds.`,
          retryAfter,
        },
        {
          status: 429,
          headers: {
            ...headers,
            "Retry-After": retryAfter.toString(),
          },
        }
      );
    }
    
    // Call the actual handler
    const response = await handler(request);
    
    // Add rate limit headers to successful response
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    return response;
  };
}

/**
 * Cleanup old entries (run periodically)
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  
  for (const [clientId, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(clientId);
    }
  }
}

// Cleanup every 10 minutes
if (typeof setInterval !== "undefined") {
  setInterval(cleanupRateLimitStore, 10 * 60 * 1000);
}

/**
 * Preset configurations for common use cases
 */
export const RateLimitPresets = {
  // Strict limit for authentication endpoints
  auth: {
    interval: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 attempts
  },
  
  // Moderate limit for payment operations
  payment: {
    interval: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 requests
  },
  
  // Generous limit for general API endpoints
  api: {
    interval: 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requests
  },
  
  // Strict limit for expensive operations
  expensive: {
    interval: 60 * 1000, // 1 minute
    maxRequests: 3, // 3 requests
  },
};
