import { useState, useCallback, useMemo, ChangeEvent, FocusEvent, FormEvent } from 'react';

// Define custom types
type FormFieldElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
type FormValues = Record<string, unknown>;
type FormErrors = Record<string, string>;
type FormTouched = Record<string, boolean>;
type ValidationRule<T extends FormValues> = {
  required?: {
    value: boolean;
    message: string;
  };
  pattern?: {
    value: RegExp;
    message: string;
  };
  custom?: (value: unknown) => string | undefined;
  when?: (values: T) => boolean;
};

type ValidationRules<T extends FormValues> = {
  [K in keyof T]: ValidationRule<T>;
};

export const useFormState = <T extends FormValues>(
  initialState: T = {} as T,
  validationRules: ValidationRules<T> = {} as ValidationRules<T>
) => {
  const [values, setValues] = useState<T>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({});

  // const validateField = useCallback((name: keyof T) => {
  //   const value = values[name];
  //   const validation = validationRules[name];
  //   if (validation) {
  //     const when = validation.when ? validation.when(values) : true;
  //     if (validation.required?.value && !value && when) {
  //       setErrors(prev => ({ ...prev, [name]: validation.required?.message ?? 'This field is required' }));
  //     } else if (validation.pattern?.value && typeof value === 'string' && !validation.pattern.value.test(value) && when) {
  //       setErrors(prev => ({ ...prev, [name]: validation?.pattern?.message ?? 'Invalid value' }));
  //     } else if (validation.custom && when) {
  //       const customError = validation.custom(value);
  //       if (customError) {
  //         setErrors(prev => ({ ...prev, [name]: customError }));
  //       }
  //     } else {
  //       setErrors(prev => {
  //         const { [name]: _, ...rest } = prev;
  //         return rest;
  //       });
  //     }
  //   }
  // }, [values, validationRules]);

  const validateField = useCallback((name: keyof T) => {
    const value = values[name];
    const validation = validationRules[name];
    let error: string | undefined;
  
    if (validation) {
      const when = validation.when ? validation.when(values) : true;
      if (when) {
        if (validation.required?.value && !value) {
          error = validation.required.message;
        } else if (validation.pattern?.value && typeof value === 'string' && !validation.pattern.value.test(value)) {
          error = validation.pattern.message;
        } else if (validation.custom) {
          error = validation.custom(value);
        }
      }
    }
  
    setErrors(prev => {
      if (error) {
        return { ...prev, [name]: error };
      } else {
        const { [name]: _, ...rest } = prev;
        return rest;
      }
    });
  }, [values, validationRules]);


  const handleChange = useCallback((event: ChangeEvent<FormFieldElement>) => {
    const { name, value, type } = event.target;
    setValues((prev) => ({ ...prev, [name]: type === 'checkbox' ? (event.target as HTMLInputElement).checked : value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    // validateField(name as keyof T);
  }, []);

  const handleBlur = useCallback((event: FocusEvent<FormFieldElement>) => {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    // validateField(name as keyof T);
  }, []);

  const handleCheckboxChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setValues((prev) => ({ ...prev, [name]: checked }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    // validateField(name as keyof T);
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
        let customErrors: string | undefined = undefined;
        if (typeof value === 'string') {
          customErrors = validation.custom(String(value));
        } else {
          customErrors = validation.custom(value);
        }
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
    handleCheckboxChange,
    handleSubmit,
    isValid,
    resetForm,
  };
};
