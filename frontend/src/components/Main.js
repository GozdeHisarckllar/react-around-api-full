import { useContext } from 'react';
import Card from './Card';
import CurrentUserContext from '../contexts/CurrentUserContext';


function Main(props) {
  const currentUser = useContext(CurrentUserContext);

  return (
    <main className="content">
      <section className="profile">
        <div className="profile__avatar-picture" style={{backgroundImage: `url(${currentUser.avatar})`}}>
          <button onClick={props.onEditAvatarClick} className="profile__button profile__button_type_avatar hover-effect" aria-label="Change avatar" type="button"></button>
        </div>
        <div className="profile__info">
          <h1 className="profile__title-name">{currentUser.name}</h1>
          <button onClick={props.onEditProfileClick} className="profile__button profile__button_type_edit hover-effect" aria-label="Edit" type="button"></button>
          <p className="profile__subtitle">{currentUser.about}</p>
        </div>
        <button onClick={props.onAddPlaceClick} className="profile__button profile__button_type_add hover-effect" aria-label="Add" type="button"></button>
      </section>
      <section className="cards">
        <ul className="cards__list">
          {props.cards ?
          props.cards.map((card) => (
            <Card key={card._id} card={card} onCardClick={props.onCardClick} 
              onCardLike={props.onCardLike} onRemoveBtnClick={props.onRemoveBtnClick}/>
          )): ''}
        </ul>
      </section>
    </main>
  );
}

export default Main;