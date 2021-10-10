import { useEffect } from "react";
import { useFormAndValidation } from '../hooks/useFormAndValidation';
import AuthForm from "./AuthForm";


const Register = ({ onRegister, onRenderRegister }) => {

  const {
    values, 
    errors, 
    isFormValid, 
    handleChange
  } = useFormAndValidation();

  useEffect(() => {
    onRenderRegister(true);
  });

  function handleSubmit(e) {
    e.preventDefault();
    const { password, email } = values;
    onRegister(password, email);
  }

  return(
    <AuthForm 
        name="sign-up"
        label="Sign up"
        values={values}
        errors={errors}
        onSubmit={handleSubmit}
        onChange={handleChange}
        isFormValid={isFormValid}
        linkLabel="Already a member? Log in here!"
        linkPath="/signin"
      />
  );
}

export default Register;