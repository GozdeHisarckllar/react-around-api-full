import { useEffect } from "react";
import { useFormAndValidation } from "../hooks/useFormAndValidation";
import AuthForm from "./AuthForm";

const Login = ({ onLogin, onRenderRegister }) => {
    
  const {
        values, 
        errors, 
        isFormValid, 
        handleChange
      } = useFormAndValidation();

    useEffect(() => {
      onRenderRegister(false);
    });

    function handleSubmit(e) {
      e.preventDefault();
      const { password, email } = values;
      onLogin(password, email);
    }

    return(
      <AuthForm 
        name="login"
        label="Log in"
        values={values}
        errors={errors}
        onSubmit={handleSubmit}
        onChange={handleChange}
        isFormValid={isFormValid}
        linkLabel="Not a member yet? Sign up here!"
        linkPath="/signup"
      />
    );
}

export default Login;