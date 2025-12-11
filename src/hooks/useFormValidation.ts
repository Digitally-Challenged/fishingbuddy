import { useState, useCallback } from 'react';

export interface ValidationRule {
  required?: boolean;
  requiredMessage?: string;
  validate?: (value: unknown) => string | null;
}

export interface ValidationRules {
  [field: string]: ValidationRule;
}

export interface ValidationErrors {
  [field: string]: string;
}

export interface UseFormValidationReturn {
  errors: ValidationErrors;
  validate: (data: Record<string, unknown>) => boolean;
  validateField: (field: string, value: unknown) => boolean;
  clearError: (field: string) => void;
  clearAllErrors: () => void;
  setError: (field: string, message: string) => void;
}

export function useFormValidation(rules: ValidationRules): UseFormValidationReturn {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = useCallback((field: string, value: unknown): boolean => {
    const rule = rules[field];
    if (!rule) return true;

    // Check required
    if (rule.required) {
      const isEmpty = value === undefined || value === null || value === '';
      if (isEmpty) {
        setErrors(prev => ({
          ...prev,
          [field]: rule.requiredMessage || `${formatFieldName(field)} is required`
        }));
        return false;
      }
    }

    // Run custom validation
    if (rule.validate) {
      const errorMessage = rule.validate(value);
      if (errorMessage) {
        setErrors(prev => ({ ...prev, [field]: errorMessage }));
        return false;
      }
    }

    // Clear error if valid
    setErrors(prev => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
    return true;
  }, [rules]);

  const validate = useCallback((data: Record<string, unknown>): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    for (const [field, rule] of Object.entries(rules)) {
      const value = data[field];

      // Check required
      if (rule.required) {
        const isEmpty = value === undefined || value === null || value === '';
        if (isEmpty) {
          newErrors[field] = rule.requiredMessage || `${formatFieldName(field)} is required`;
          isValid = false;
          continue;
        }
      }

      // Run custom validation
      if (rule.validate) {
        const errorMessage = rule.validate(value);
        if (errorMessage) {
          newErrors[field] = errorMessage;
          isValid = false;
        }
      }
    }

    setErrors(newErrors);
    return isValid;
  }, [rules]);

  const clearError = useCallback((field: string) => {
    setErrors(prev => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  const setError = useCallback((field: string, message: string) => {
    setErrors(prev => ({ ...prev, [field]: message }));
  }, []);

  return {
    errors,
    validate,
    validateField,
    clearError,
    clearAllErrors,
    setError
  };
}

// Helper to format field names for error messages
function formatFieldName(field: string): string {
  return field
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}
