function PopupWithForm(props) {
  const className = `modal modal_type_${props.name} ${props.isOpen ? 'modal_opened': ''}`;

  return (
    <div className={className}>
      <div className="modal__container">
        <form action="#" className="form" name={props.name} onSubmit={props.onSubmit}>
          <fieldset className="form__input-container">
            <legend className="form__caption">{props.title}</legend>
            {props.children}
            <button type="submit" className={`form__button ${!props.isFormValid?'form__button_disabled':''}`} 
              disabled={!props.isFormValid && true}>{props.isLoading ? props.loadingButtonLabel : props.buttonLabel}</button>
          </fieldset>
        </form>
        <button onClick={props.onClose} className="modal__close-btn hover-effect" aria-label="Close" type="button"></button>
      </div>
    </div>
  );
}

export default PopupWithForm;