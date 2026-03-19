import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';

/**
 * ProtectedRoute component for handling authentication-based routing
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {string|string[]} [props.roles] - Required role(s) to access the route
 * @param {string|string[]} [props.permissions] - Required permission(s) to access the route
 * @param {boolean} [props.requireAuth=true] - Whether authentication is required
 * @param {boolean} [props.requireEmailVerification=false] - Whether email verification is required
 * @param {string} [props.redirectTo='/login'] - Where to redirect if not authorized
 * @param {boolean} [props.strict=false] - If true, role must match exactly; if false, allows higher roles
 * @param {boolean} [props.requireAll=false] - If true, requires all permissions; if false, requires any
 * @param {React.ReactNode} [props.fallback] - Custom fallback component
 */
export default function ProtectedRoute({
  children,
  roles,
  permissions,
  requireAuth = true,
  requireEmailVerification = false,
  redirectTo = '/login',
  strict = false,
  requireAll = false,
  fallback
}) {
  const {
    isAuthenticated,
    isLoading,
    user,
    hasRole,
    hasPermission
  } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">جاري التحقق من صلاحية الوصول...</p>
        </div>
      </div>
    );
  }

  // Check if authentication is required
  if (requireAuth && !isAuthenticated) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Check email verification requirement
  if (requireEmailVerification && user && !user.isEmailVerified) {
    return (
      <Navigate 
        to="/verify-email" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Check role-based access
  if (roles && isAuthenticated) {
    const roleList = Array.isArray(roles) ? roles : [roles];
    const hasRequiredRole = roleList.some(role => {
      if (strict) {
        return user?.role === role;
      } else {
        return hasRole(role);
      }
    });

    if (!hasRequiredRole) {
      return (
        <Navigate 
          to="/unauthorized" 
          state={{ from: location, requiredRoles: roleList }} 
          replace 
        />
      );
    }
  }

  // Check permission-based access
  if (permissions && isAuthenticated) {
    const permissionList = Array.isArray(permissions) ? permissions : [permissions];
    const hasRequiredPermissions = requireAll
      ? permissionList.every(permission => hasPermission(permission))
      : permissionList.some(permission => hasPermission(permission));

    if (!hasRequiredPermissions) {
      return (
        <Navigate 
          to="/unauthorized" 
          state={{ from: location, requiredPermissions: permissionList }} 
          replace 
        />
      );
    }
  }

  // All checks passed, render children
  return children;
}

/**
 * Higher-order component for protecting routes
 * @param {React.Component} Component - Component to protect
 * @param {Object} options - Protection options
 */
export function withProtectedRoute(Component, options = {}) {
  return function ProtectedComponent(props) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

/**
 * Component for handling unauthorized access
 */
export function UnauthorizedPage() {
  const location = useLocation();
  const { user } = useAuth();
  
  const requiredRoles = location.state?.requiredRoles || [];
  const requiredPermissions = location.state?.requiredPermissions || [];
  const from = location.state?.from;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            غير مصرح بالوصول
          </h2>
          <p className="mt-2 text-gray-600">
            لا تملك الصلاحية الكافية للوصول إلى هذه الصفحة
          </p>
        </div>

        {(requiredRoles.length > 0 || requiredPermissions.length > 0) && (
          <div className="mb-6 p-4 bg-yellow-50 rounded-xl">
            <p className="text-sm text-yellow-800 mb-2">
              الصلاحيات المطلوبة:
            </p>
            {requiredRoles.length > 0 && (
              <div className="text-sm text-yellow-700">
                <strong>الأدوار:</strong> {requiredRoles.join('، ')}
              </div>
            )}
            {requiredPermissions.length > 0 && (
              <div className="text-sm text-yellow-700">
                <strong>الصلاحيات:</strong> {requiredPermissions.join('، ')}
              </div>
            )}
            {user && (
              <div className="text-sm text-yellow-700 mt-2">
                <strong>دورك الحالي:</strong> {user.role}
              </div>
            )}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => window.history.back()}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            العودة للخلف
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            العودة للصفحة الرئيسية
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Component for email verification requirement
 */
export function EmailVerificationPage() {
  const { user, sendVerificationEmail } = useAuth();
  const [sending, setSending] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  const handleResend = async () => {
    try {
      setSending(true);
      await sendVerificationEmail();
      setSent(true);
    } catch (error) {
      console.error('Failed to send verification email:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            تأكيد البريد الإلكتروني مطلوب
          </h2>
          <p className="mt-2 text-gray-600">
            يجب تأكيد بريدك الإلكتروني للمتابعة
          </p>
        </div>

        <div className="mb-6 p-4 bg-blue-50 rounded-xl">
          <p className="text-sm text-blue-800">
            تم إرسال رسالة تأكيد إلى:
          </p>
          <p className="font-medium text-blue-900">
            {user?.email}
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleResend}
            disabled={sending || sent}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {sending ? 'جاري الإرسال...' : sent ? 'تم الإرسال' : 'إعادة إرسال رسالة التأكيد'}
          </button>
          <button
            onClick={() => window.location.href = '/logout'}
            className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            تسجيل الخروج
          </button>
        </div>
      </div>
    </div>
  );
}