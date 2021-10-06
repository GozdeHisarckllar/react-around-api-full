import { Link } from "react-router-dom";
import { inputElementErrorClassName, errorClassName } from "../utils/constants";

const AuthForm = (props) => {
  return(
    <div className="auth-container">
      <form action="#" onSubmit={props.onSubmit} className="form form_type_auth" name={props.name}>
        <fieldset className="form__input-container form__input-container_type_auth">
          <legend className="form__caption form__caption_type_auth">{props.label}</legend>
          <label className="form__label">
          <input type="email" className={`form__item form__item_el_email ${props.errors['email']? inputElementErrorClassName:''}`} 
            value={props.values['email'] || ''} onChange={props.onChange} id="email-input" name="email" placeholder="Email" required/>
          <span className={`form__input-error email-input-error ${props.errors['email']? errorClassName:''}`}>{props.errors['email']}</span>
        </label>
        <label className="form__label">
          <input type="password" className={`form__item form__item_el_password ${props.errors['password']? inputElementErrorClassName:''}`} 
            value={props.values['password'] || ''} onChange={props.onChange} id="password-input" name="password" placeholder="Password" minLength="6" maxLength="30" required/>
          <span className={`form__input-error password-input-error ${props.errors['password']? errorClassName:''}`}>{props.errors['password']}</span>
        </label>
            <button type="submit" className={`form__button form__button_type_auth ${!props.isFormValid?'form__button_disabled':''}`} 
              disabled={!props.isFormValid && true}>{props.label}</button>
            <Link to={props.linkPath} className="form__auth-redirect">{props.linkLabel}</Link>
        </fieldset>
      </form> 
    </div>   
  )
}

export default AuthForm;