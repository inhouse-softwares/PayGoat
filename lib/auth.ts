/**
 * Legacy auth.ts - Re-exports from centralized auth-utils
 * Maintained for backward compatibility
 */

export {
  AUTH_COOKIE_NAME,
  getSession,
  getSessionRole,
  isAuthenticated,
  setSession as setAuthenticatedSession,
  clearSession as clearAuthenticatedSession,
  type SessionData,
} from "./auth-utils";
