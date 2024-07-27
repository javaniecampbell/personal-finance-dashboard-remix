import { useState, useCallback } from 'react';

type ValidationRule = {
  required?: { value: boolean; message: string };
  pattern?: { value: RegExp; message: string };
  custom?: (value: any) => string | undefined;
};

type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule;
};

export function useFormState<T extends Record<string, any>>(
  initialState: T,
  validationRules: ValidationRules<T> = {}
) {
  const [values, setValues] = useState<T>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const validateField = useCallback((name: keyof T, value: any) => {
    const rules = validationRules[name];
    if (!rules) return;

    if (rules.required?.value && !value) {
      return rules.required.message;
    }

    if (rules.pattern?.value && !rules.pattern.value.test(value)) {
      return rules.pattern.message;
    }

    if (rules.custom) {
      return rules.custom(value);
    }
  }, [validationRules]);

  const validateForm = useCallback(() => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(values).forEach((key) => {
      const error = validateField(key as keyof T, values[key as keyof T]);
      if (error) {
        newErrors[key as keyof T] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validateField]);

  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>, onSubmit: (values: T) => void) => {
    event.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      onSubmit(values);
    }
  }, [values, validateForm]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    setValues,
  };
}
