import { useAuthContext } from '../contexts/AuthContext';

/**
 * Custom hook for authentication
 * Provides easy access to auth state and methods
 */
export function useAuth() {
  const context = useAuthContext();
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return {
    // Auth State
    user: context.user,
    token: context.token,
    isAuthenticated: context.isAuthenticated,
    isLoading: context.isLoading,
    error: context.error,
    
    // Auth Methods
    login: context.login,
    register: context.register,
    logout: context.logout,
    updateProfile: context.updateProfile,
    changePassword: context.changePassword,
    forgotPassword: context.forgotPassword,
    resetPassword: context.resetPassword,
    clearError: context.clearError,
    
    // Helper Methods
    hasRole: context.hasRole,
    hasPermission: context.hasPermission,
    isAdmin: context.isAdmin,
    isSeller: context.isSeller,
    isUser: context.isUser,
    
    // Computed Properties
    userFullName: context.user ? `${context.user.firstName} ${context.user.lastName}` : '',
    userInitials: context.user ? 
      `${context.user.firstName?.charAt(0) || ''}${context.user.lastName?.charAt(0) || ''}`.toUpperCase() : '',
    
    // Status Checks
    canCreateAuction: context.user?.role === 'seller' || context.user?.role === 'admin',
    canManageAuctions: context.user?.role === 'admin',
    canBid: context.user?.role === 'user' || context.user?.role === 'seller',
    canModerate: context.user?.role === 'admin' || context.user?.role === 'moderator'
  };
}

// Additional utility hooks for specific use cases

/**
 * Hook for checking if user is authenticated
 * Returns loading state until auth is initialized
 */
export function useAuthCheck() {
  const { isAuthenticated, isLoading } = useAuth();
  return { isAuthenticated, isLoading };
}

/**
 * Hook for getting current user info
 * Returns null if not authenticated
 */
export function useCurrentUser() {
  const { user, isAuthenticated } = useAuth();
  return isAuthenticated ? user : null;
}

/**
 * Hook for role-based access control
 * @param {string} requiredRole - Role required to access
 * @param {boolean} strict - If true, must match exactly; if false, allows higher roles
 */
export function useRoleAccess(requiredRole, strict = false) {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || !user) {
    return false;
  }
  
  const userRole = user.role;
  
  if (strict) {
    return userRole === requiredRole;
  }
  
  // Role hierarchy: admin > moderator > seller > user
  const roleHierarchy = {
    'user': 1,
    'seller': 2,
    'moderator': 3,
    'admin': 4
  };
  
  const userRoleLevel = roleHierarchy[userRole] || 0;
  const requiredRoleLevel = roleHierarchy[requiredRole] || 0;
  
  return userRoleLevel >= requiredRoleLevel;
}

/**
 * Hook for permission-based access control
 * @param {string|string[]} permissions - Permission(s) required
 * @param {boolean} requireAll - If true, requires all permissions; if false, requires any
 */
export function usePermissionAccess(permissions, requireAll = false) {
  const { user, hasPermission } = useAuth();
  
  if (!user) {
    return false;
  }
  
  const permissionList = Array.isArray(permissions) ? permissions : [permissions];
  
  if (requireAll) {
    return permissionList.every(permission => hasPermission(permission));
  } else {
    return permissionList.some(permission => hasPermission(permission));
  }
}

/**
 * Hook for authentication error handling
 * Automatically clears error after specified time
 */
export function useAuthError(autoClearMs = 5000) {
  const { error, clearError } = useAuth();
  
  React.useEffect(() => {
    if (error && autoClearMs > 0) {
      const timer = setTimeout(() => {
        clearError();
      }, autoClearMs);
      
      return () => clearTimeout(timer);
    }
  }, [error, autoClearMs, clearError]);
  
  return { error, clearError };
}

/**
 * Hook for handling authentication redirects
 * Redirects to login if not authenticated, or to intended destination after login
 */
export function useAuthRedirect(redirectTo = '/login') {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(redirectTo, {
        replace: true,
        state: { from: location }
      });
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo, location]);
  
  return { isAuthenticated, isLoading };
}

export default useAuth;