import { useState, useCallback, useMemo, ChangeEvent, FocusEvent, FormEvent } from 'react';

// Define custom types
type FormValues = Record<string, unknown>;
type FormErrors = Record<string, string>;
type FormTouched = Record<string, boolean>;
type ValidationRule = {
  required?: {
    value: boolean;
    message: string;
  };
  pattern?: {
    value: RegExp;
    message: string;
  };
  custom?: (value: string) => string | undefined;
  when?: (values: FormValues) => boolean;
};

type ValidationRules = Record<string, ValidationRule>;

export const useFormState = <T extends FormValues>(
  initialState: T = {} as T,
  validationRules: ValidationRules = {}
) => {
  const [values, setValues] = useState<T>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({});

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const handleBlur = useCallback((event: FocusEvent<HTMLInputElement>) => {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const validate = useCallback(() => {
    const newErrors: FormErrors = {};
    Object.keys(validationRules).forEach((key) => {
      const value = values[key];
      const validation = validationRules[key];
      const when = validation?.when ? validation.when(values) : true;
      if (validation?.required?.value && !value && when) {
        newErrors[key] = validation?.required?.message;
      } else if (validation?.pattern?.value && typeof value === 'string' && !validation.pattern.value.test(value) && when) {
        newErrors[key] = validation?.pattern?.message;
      } else if (validation?.custom && when) {
        const customErrors = validation.custom(String(value));
        if (customErrors) {
          newErrors[key] = customErrors;
        }
      }
    });
    setErrors(newErrors);
    return newErrors;
  }, [values, validationRules]);

  const handleSubmit = useCallback((onSubmit: (values: T) => void) => (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length === 0) {
      onSubmit(values);
    }
  }, [values, validate]);

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const resetForm = useCallback(() => {
    setValues(initialState);
    setErrors({});
    setTouched({});
  }, [initialState]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isValid,
    resetForm,
  };
};
