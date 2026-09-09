export interface ValidationIssue {
  field: string;
  message: string;
}

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
}

// User Registration Interface
export interface RegisterFormData {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  country: string;
  language: 'ar' | 'en';
  dateOfBirth: string;
  role: 'student' | 'parent' | 'teacher';
}

// User Login Interface
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Forgot Password Interface
export interface ForgotPasswordFormData {
  email: string;
}

// Reset Password Interface
export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

// Change Password Interface
export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Validate Registration Data
 */
export function validateRegistration(data: Partial<RegisterFormData>, lang: 'ar' | 'en' = 'ar'): ValidationResult<RegisterFormData> {
  const errors: Record<string, string> = {};

  // Full Name
  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.fullName = lang === 'ar' ? 'الاسم الكامل يجب ألا يقل عن حرفين' : 'Full name must be at least 2 characters';
  }

  // Username
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
  if (!data.username || !usernameRegex.test(data.username)) {
    errors.username = lang === 'ar' 
      ? 'اسم المستخدم يجب أن يكون بين 3 و 30 حرفاً بالإنجليزية والأرقام وبدون مسافات' 
      : 'Username must be 3-30 alphanumeric characters or underscores';
  }

  // Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.email = lang === 'ar' ? 'يرجى إدخال بريد إلكتروني صالح' : 'Please enter a valid email address';
  }

  // Password
  if (!data.password || data.password.length < 8) {
    errors.password = lang === 'ar' ? 'كلمة المرور يجب ألا تقل عن 8 خانات' : 'Password must be at least 8 characters';
  } else if (!/(?=.*[a-z])(?=.*[A-Z])|(?=.*\d)/.test(data.password)) {
    errors.password = lang === 'ar' ? 'يجب أن تحتوي كلمة المرور على أحرف كبيرة وصغيرة أو أرقام' : 'Password must include uppercase/lowercase or numbers';
  }

  // Confirm Password
  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = lang === 'ar' ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match';
  }

  // Country
  if (!data.country || !data.country.trim()) {
    errors.country = lang === 'ar' ? 'يرجى اختيار الدولة' : 'Please select your country';
  }

  // Role
  const validRoles = ['student', 'parent', 'teacher'];
  if (!data.role || !validRoles.includes(data.role)) {
    errors.role = lang === 'ar' ? 'يرجى تحديد الصفة (طالب / ولي أمر / معلم)' : 'Please select your role (Student / Parent / Teacher)';
  }

  // Language
  if (data.language && !['ar', 'en'].includes(data.language)) {
    errors.language = lang === 'ar' ? 'اللغة غير صالحة' : 'Invalid language';
  }

  // Date of Birth
  if (!data.dateOfBirth) {
    errors.dateOfBirth = lang === 'ar' ? 'يرجى إدخال تاريخ الميلاد' : 'Please enter date of birth';
  } else {
    const dob = new Date(data.dateOfBirth);
    const now = new Date();
    if (isNaN(dob.getTime()) || dob > now) {
      errors.dateOfBirth = lang === 'ar' ? 'تاريخ الميلاد غير صالح' : 'Invalid date of birth';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      fullName: data.fullName!.trim(),
      username: data.username!.trim().toLowerCase(),
      email: data.email!.trim().toLowerCase(),
      password: data.password!,
      confirmPassword: data.confirmPassword!,
      country: data.country!.trim(),
      language: data.language || 'ar',
      dateOfBirth: data.dateOfBirth!,
      role: data.role as 'student' | 'parent' | 'teacher',
    },
  };
}

/**
 * Validate Login Data
 */
export function validateLogin(data: Partial<LoginFormData>, lang: 'ar' | 'en' = 'ar'): ValidationResult<LoginFormData> {
  const errors: Record<string, string> = {};

  if (!data.email || !data.email.trim()) {
    errors.email = lang === 'ar' ? 'يرجى إدخال البريد الإلكتروني أو اسم المستخدم' : 'Email or username is required';
  }

  if (!data.password || data.password.length < 6) {
    errors.password = lang === 'ar' ? 'كلمة المرور مطلوبة (6 خانات على الأقل)' : 'Password must be at least 6 characters';
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      email: data.email!.trim().toLowerCase(),
      password: data.password!,
      rememberMe: Boolean(data.rememberMe),
    },
  };
}

/**
 * Validate Forgot Password Data
 */
export function validateForgotPassword(data: Partial<ForgotPasswordFormData>, lang: 'ar' | 'en' = 'ar'): ValidationResult<ForgotPasswordFormData> {
  const errors: Record<string, string> = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!data.email || !emailRegex.test(data.email.trim())) {
    errors.email = lang === 'ar' ? 'يرجى إدخال بريد إلكتروني صالح ومسجل لدينا' : 'Please enter a valid registered email';
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: { email: data.email!.trim().toLowerCase() },
  };
}

/**
 * Validate Reset Password Data
 */
export function validateResetPassword(data: Partial<ResetPasswordFormData>, lang: 'ar' | 'en' = 'ar'): ValidationResult<ResetPasswordFormData> {
  const errors: Record<string, string> = {};

  if (!data.password || data.password.length < 8) {
    errors.password = lang === 'ar' ? 'كلمة المرور الجديدة يجب ألا تقل عن 8 خانات' : 'New password must be at least 8 characters';
  }

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = lang === 'ar' ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match';
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: { password: data.password!, confirmPassword: data.confirmPassword! },
  };
}

/**
 * Zod-style validation helper object
 */
export const authSchemas = {
  validateRegistration,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
};
