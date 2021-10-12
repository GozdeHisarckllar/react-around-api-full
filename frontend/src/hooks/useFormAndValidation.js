import { useState, useCallback } from 'react';

export function useFormAndValidation() {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
   

  const handleChange = (e) => {
    const {name, value} = e.target;
    setValues({...values, [name]: value});
    setErrors({...errors, [name]: e.target.validationMessage});
    setIsFormValid(e.target.closest('form').checkValidity());
  };

  const resetFormValidation = useCallback((newValues={}, newErrors={}, newIsValid=false) => {
    setValues(newValues);
    setErrors(newErrors);
    setIsFormValid(newIsValid);
  }, [setValues, setErrors, setIsFormValid]);

  return { values, errors, isFormValid, handleChange, resetFormValidation, setValues, setIsFormValid };
}
