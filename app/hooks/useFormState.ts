import { useState, useCallback, useMemo } from 'react';

export const useFormState = (initialState = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const handleBlur = useCallback((event) => {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const validate = useCallback(() => {
    const newErrors = {};
    Object.keys(validationRules).forEach((key) => {
      const value = values[key];
      const validation = validationRules[key];
      if (validation?.required?.value && !value) {
        newErrors[key] = validation?.required?.message;
      } else if (validation?.pattern?.value && !validation.pattern.value.test(value)) {
        newErrors[key] = validation?.pattern?.message;
      } else if (validation?.custom) {
        const customErrors = validation.custom(value);
        if (customErrors) {
          newErrors[key] = customErrors;
        }
      }
    });
    setErrors(newErrors);
    return newErrors;
  }, [values, validationRules]);

  const handleSubmit = useCallback((onSubmit) => (event) => {
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
