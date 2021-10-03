import { useEffect } from 'react';
import PopupWithForm from './PopupWithForm';
import { inputElementErrorClassName, errorClassName} from '../utils/constants';
import { useFormAndValidation } from '../hooks/useFormAndValidation';


function AddPlacePopup({ isOpen, onClose, onAddPlaceSubmit, isLoading }) {
  const {
    values, 
    errors, 
    isFormValid, 
    handleChange,
    resetFormValidation 
  } = useFormAndValidation();
  
  
  function handleSubmit(e) {
    e.preventDefault();

    onAddPlaceSubmit(values);
  }

  useEffect(() => {
    resetFormValidation();
  },[isOpen, resetFormValidation]);

  return(
    <PopupWithForm 
      name="add-card" 
      title="New place" 
      buttonLabel="Create"
      loadingButtonLabel='Creating...'
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      isFormValid={isFormValid}
    >
      <label className="form__label">
        <input type="text" className={`form__item form__item_el_card-title ${errors['name']? inputElementErrorClassName:''}`}
          value={values['name'] || ''} onChange={handleChange} id="card-title-input" name="name" placeholder="Title" maxLength="30" required/>
        <span className={`form__input-error card-title-input-error ${errors['name']? errorClassName:''}`}>{errors['name']}</span>
      </label>
      <label className="form__label">
        <input type="url" className={`form__item form__item_el_card-link ${errors['link']? inputElementErrorClassName:''}`}
          value={values['link'] || ''} onChange={handleChange} id="card-link-input" name="link" placeholder="Image URL" required/>
        <span className={`form__input-error card-link-input-error ${errors['link']? errorClassName:''}`}>{errors['link']}</span>
      </label>
    </PopupWithForm>
  );
}

export default AddPlacePopup;