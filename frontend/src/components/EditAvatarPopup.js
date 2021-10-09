import { useContext, useEffect } from 'react';
import CurrentUserContext from '../contexts/CurrentUserContext';
import PopupWithForm from './PopupWithForm';
import { inputElementErrorClassName, errorClassName} from '../utils/constants';
import { useFormAndValidation } from '../hooks/useFormAndValidation';


function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar, isLoading }){
  const currentUser = useContext(CurrentUserContext);
  
  const {
    values, 
    errors, 
    isFormValid, 
    handleChange, 
    resetFormValidation
  } = useFormAndValidation();


  function handleSubmit(e) {
    e.preventDefault();

    onUpdateAvatar(values);
  }

  useEffect(() => {
    resetFormValidation();
  }, [currentUser, isOpen, resetFormValidation]);

  return(
    <PopupWithForm 
      name="change-avatar" 
      title="Change profile picture" 
      buttonLabel="Save"
      loadingButtonLabel = "Saving..."
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      isFormValid={isFormValid}
    >
      <label className="form__label">
        <input type="url" className={`form__item form__item_el_avatar-link ${errors['avatar']? inputElementErrorClassName:''}`} 
          value={values['avatar'] || ''} onChange={handleChange} id="avatar-link-input" name="avatar" placeholder="Picture URL" required/>
        <span className={`form__input-error avatar-link-input-error ${errors['avatar']? errorClassName:''}`}>{errors['avatar']}</span>
      </label>
    </PopupWithForm>
  )
}

export default EditAvatarPopup;