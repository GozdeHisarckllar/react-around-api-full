import PopupWithForm from './PopupWithForm';


function ConfirmationPopup(props) {

  function handleSubmit(e) {
    e.preventDefault();

    props.onCardDelete(props.card);
  }

  return(
    <PopupWithForm 
      name="remove-verify" 
      title="Are you sure?" 
      buttonLabel="Yes"
      loadingButtonLabel = "Deleting..."
      onSubmit={handleSubmit}
      isOpen={props.isOpen}
      onClose={props.onClose}
      isLoading={props.isLoading}
      isFormValid={true}
    />
  );
}

export default ConfirmationPopup;