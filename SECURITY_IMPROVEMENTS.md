# Security Improvements: Session, Isolation, and RBAC

## Overview

This document outlines the comprehensive security improvements made to the PayGoat application, focusing on:
1. **Session Management** - Consistent and secure session handling
2. **Isolation** - Proper tenant/instance isolation between operators
3. **RBAC** - Role-based access control with industry standards

## Changes Made

### 1. Centralized Authentication & Authorization (`lib/auth-utils.ts`)

Created a comprehensive authentication utility module that provides:

#### Core Functions
- `getSession()` - Get current session from cookies
- `getSessionRole()` - Get user role only
- `isAuthenticated()` - Check authentication status
- `setSession()` - Set session cookie with consistent duration (7 days)
- `clearSession()` - Clear session cookie

#### Authorization Helpers
- `requireAuth()` - Throws 401 if not authenticated
- `requireAdmin()` - Throws 403 if not admin
- `requireOperator()` - Throws 403 if not operator
- `requireInstanceAccess(instanceId)` - Checks if user can access specific instance
- `getInstanceFilter()` - Returns database filter based on user role

#### Error Handling
- `AuthError` - Custom error class for auth failures
- `handleAuthError()` - Centralized error handler
- `withAuth()` - Wrapper for API routes with automatic auth error handling

### 2. Session Duration Consistency

**Before:**
- Middleware: 8 hours
- Login route: 7 days
- Inconsistent session lifetimes

**After:**
- Unified: 7 days across entire application
- Defined in `SESSION_MAX_AGE` constant
- Single source of truth

### 3. API Route Authorization

Updated all API routes with proper authorization:

#### Collections API (`app/api/collections/route.ts`)
```typescript
export const GET = withAuth(async (request) => {
  await requireAuth();
  const roleFilter = await getInstanceFilter();
  // Operators automatically filtered to their instance
  // Admins can query all or filter by instanceId
});

export const POST = withAuth(async (request) => {
  const session = await requireAuth();
  // Verify operator cannot create collections for other instances
  if (session.role === "operator" && session.instanceId !== body.instanceId) {
    throw new AuthError("Forbidden", 403);
  }
});
```

#### Collections Detail API (`app/api/collections/[id]/route.ts`)
```typescript
export const GET = withAuth(async (request, { params }) => {
  const collection = await prisma.paymentCollection.findUnique({...});
  // Verify user has access to this instance
  await requireInstanceAccess(collection.instanceId);
});

export const DELETE = withAuth(async (request, { params }) => {
  // Same instance access check before deletion
  await requireInstanceAccess(collection.instanceId);
});
```

#### Instances API (`app/api/instances/route.ts`)
```typescript
export const GET = withAuth(async () => {
  await requireAuth();
  const filter = await getInstanceFilter();
  // Operators only see their assigned instance
  // Admins see all instances
});

export const POST = withAuth(async (request) => {
  await requireAdmin(); // Only admins can create instances
  
  // Wrapped in transaction for atomicity
  await prisma.$transaction(async (tx) => {
    const instance = await tx.paymentInstance.create({...});
    await tx.user.create({...}); // Create operator
    return { instance, operatorEmail, operatorPassword };
  });
});
```

#### Instance Detail API (`app/api/instances/[id]/route.ts`)
```typescript
export const GET = withAuth(async (request, { params }) => {
  await requireInstanceAccess(id); // Check access first
  const instance = await prisma.paymentInstance.findUnique({...});
});

export const DELETE = withAuth(async (request, { params }) => {
  await requireAdmin(); // Only admins can delete
});

export const PATCH = withAuth(async (request, { params }) => {
  await requireAdmin(); // Only admins can update
  // Already using $transaction for atomic updates
});
```

#### Profile API (`app/api/profile/route.ts`)
```typescript
export const GET = withAuth(async () => {
  const session = await requireAuth();
  // Automatically scoped to user's role
});

export const PATCH = withAuth(async (request) => {
  const session = await requireAuth();
  // Password change with validation
});
```

#### Admin API (`app/api/admin/operators/route.ts`)
```typescript
export const GET = withAuth(async () => {
  await requireAdmin(); // Only admins can view operators
});
```

### 4. Transaction Wrapper for Instance Creation

**Before:** Instance and operator creation were separate operations
```typescript
const instance = await prisma.paymentInstance.create({...});
await prisma.user.create({...}); // Could fail after instance created
```

**After:** Atomic transaction ensures both succeed or both fail
```typescript
await prisma.$transaction(async (tx) => {
  const instance = await tx.paymentInstance.create({...});
  await tx.user.create({...});
  return { instance, operatorEmail, operatorPassword };
});
```

### 5. Enhanced Middleware (`middleware.ts`)

Improved middleware with clear separation of concerns:

#### Features
- **Authentication check** - Redirect unauthenticated users to login
- **API route passthrough** - Let route handlers manage API auth
- **Admin route protection** - Operators redirected to their workspace
- **Operator instance isolation** - Operators can only access their instance
- **Smart redirects** - Role-based home page routing

#### Key Improvements
1. **Separation of concerns**: Admin failures don't affect operators
2. **API route handling**: Middleware doesn't block API calls
3. **Clear comments**: Each section is well-documented
4. **Extended matcher**: Covers all protected routes including API

```typescript
export const config = {
  matcher: [
    // Page routes
    "/", "/dashboard/:path*", "/pay/:path*", "/logs/:path*",
    "/login", "/profile/:path*", "/operators/:path*",
    // API routes (auth handled by route handlers)
    "/api/instances/:path*", "/api/collections/:path*",
    "/api/profile/:path*", "/api/admin/:path*",
  ],
};
```

### 6. Backward Compatibility (`lib/auth.ts`)

The original `auth.ts` file now re-exports from `auth-utils.ts`:
```typescript
export {
  AUTH_COOKIE_NAME,
  getSession,
  getSessionRole,
  isAuthenticated,
  setSession as setAuthenticatedSession,
  clearSession as clearAuthenticatedSession,
  type SessionData,
} from "./auth-utils";
```

This ensures existing code continues to work without changes.

## Security Benefits

### 1. Defense in Depth
- **Multiple layers**: Middleware + API route auth
- **Fail-safe**: Missing auth checks caught by helpers
- **Centralized logic**: Single source of truth

### 2. Isolation Guarantees
- **Database level**: Queries automatically filtered by role
- **Route level**: Instance access verified before operations
- **Middleware level**: URL-based access control

### 3. Audit Trail
- **Consistent logging**: Auth errors logged centrally
- **Clear error messages**: Users know why access denied
- **Type safety**: TypeScript ensures correct usage

### 4. Scalability
- **Easy to extend**: Add new roles or permissions
- **Reusable helpers**: Use across all routes
- **Maintainable**: Single place to update auth logic

## Migration Guide

### For Existing Code

No changes required! Existing imports from `lib/auth.ts` continue to work.

### For New Code

Use the new auth utilities:

```typescript
import { requireAuth, requireAdmin, requireInstanceAccess, withAuth } from "@/lib/auth-utils";

// Simple authentication
export const GET = withAuth(async () => {
  await requireAuth();
  // Your code here
});

// Admin-only endpoint
export const POST = withAuth(async (request) => {
  await requireAdmin();
  // Admin-only code
});

// Instance-specific endpoint
export const GET = withAuth(async (request, { params }) => {
  await requireInstanceAccess(params.id);
  // Access to specific instance verified
});
```

## Testing Recommendations

### Test Cases

1. **Authentication**
   - [ ] Unauthenticated users redirected to login
   - [ ] Valid sessions allow access
   - [ ] Expired sessions handled correctly

2. **Admin Access**
   - [ ] Admins can access all instances
   - [ ] Admins can create/update/delete instances
   - [ ] Admins can view operator list

3. **Operator Isolation**
   - [ ] Operators only see their instance
   - [ ] Operators cannot access other instances
   - [ ] Operators cannot modify instance settings
   - [ ] Operators can create collections for their instance

4. **API Security**
   - [ ] Unauthorized API calls return 401
   - [ ] Forbidden operations return 403
   - [ ] Instance access violations detected
   - [ ] Transaction rollback on errors

5. **Edge Cases**
   - [ ] Operator with missing instanceId handled
   - [ ] Invalid session format rejected
   - [ ] Concurrent requests handled correctly

## Performance Considerations

### Optimizations
- **Single session parse**: Session parsed once in middleware
- **Efficient queries**: Role-based filters applied at database level
- **Error short-circuit**: Auth failures return immediately

### Potential Issues
- **Multiple auth checks**: Some routes check auth twice (middleware + handler)
  - **Mitigation**: Middleware does minimal work, handlers do authorization
- **Transaction overhead**: Instance creation now in transaction
  - **Impact**: Minimal, ensures data consistency

## Future Enhancements

1. **Session Refresh**: Auto-refresh sessions before expiry
2. **Permission System**: More granular permissions beyond admin/operator
3. **Audit Logging**: Log all access attempts and changes
4. **Rate Limiting**: Prevent brute force attacks
5. **Multi-factor Auth**: Add 2FA for admin accounts
6. **JWT Tokens**: Consider JWT for stateless auth (if needed)

## Conclusion

These improvements establish a solid security foundation with:
- ✅ Consistent session management
- ✅ Proper tenant isolation
- ✅ Industry-standard RBAC
- ✅ Defense in depth
- ✅ Scalable architecture

The application now follows security best practices while maintaining backward compatibility and ease of use.
