import { useContext, useEffect } from 'react';
import PopupWithForm from './PopupWithForm';
import CurrentUserContext from '../contexts/CurrentUserContext';
import { inputElementErrorClassName, errorClassName} from '../utils/constants';
import { useFormAndValidation } from '../hooks/useFormAndValidation';


function EditProfilePopup({ isOpen, onClose, onUpdateUser, isLoading}) {
  const currentUser = useContext(CurrentUserContext);

  const {
    values, 
    errors, 
    isFormValid, 
    handleChange, 
    resetFormValidation, 
    setValues
  } = useFormAndValidation();


  function handleSubmit(e) {
    e.preventDefault();
    
    onUpdateUser(values);
  }

  useEffect(() => {
    resetFormValidation();
    setValues({name: currentUser.name, about: currentUser.about});
  }, [currentUser, isOpen, setValues, resetFormValidation]);

  return(
    <PopupWithForm 
    name="edit-profile" 
    title="Edit profile" 
    buttonLabel="Save"
    loadingButtonLabel = "Saving..."
    isOpen={isOpen}
    onClose={onClose}
    onSubmit={handleSubmit}
    isLoading = {isLoading}
    isFormValid={isFormValid}
    >
      <label className="form__label">
        <input type="text" className={`form__item form__item_el_name ${errors['name']? inputElementErrorClassName:''}`} 
          value={values['name'] || ''} onChange={handleChange} id="name-input" name="name" placeholder="Name" minLength="2" maxLength="40" required/>
        <span className={`form__input-error name-input-error ${errors['name']? errorClassName:''}`}>{errors['name']}</span>
      </label>
      <label className="form__label">
        <input type="text" className={`form__item form__item_el_subtitle ${errors['about']? inputElementErrorClassName:''}`} 
          value={values['about'] || ''} onChange={handleChange} id="subtitle-input" name="about" placeholder="About me" minLength="2" maxLength="200" required/>
        <span className={`form__input-error subtitle-input-error ${errors['about']? errorClassName:''}`}>{errors['about']}</span>
      </label>
    </PopupWithForm>
  );

}

export default EditProfilePopup;