function ImagePopup(props) {
  return (
    <div className={`modal modal_type_image-detail ${props.card ? 'modal_opened' : 'modal_transition_none'}`} >
      <div className="modal__container modal__container_size_fit">
        <figure className="modal__figure">
          <img className="modal__image" src={props.card?.link} alt={props.card?.name}/>
          <figcaption className="modal__image-caption">{props.card?.name}</figcaption>
        </figure>
        <button className="modal__close-btn hover-effect" onClick={props.onClose} aria-label="Close" type="button"></button>
      </div>
    </div>
  );
}

export default ImagePopup;