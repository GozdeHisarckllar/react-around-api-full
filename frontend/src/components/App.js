import { useState, useEffect, useCallback } from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Register from './Register';
import Login from './Login';
import InfoTooltip from './InfoTooltip';
import * as auth from '../utils/auth';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import CurrentUserContext from '../contexts/CurrentUserContext';
import EditAvatarPopup from './EditAvatarPopup';
import ConfirmationPopup from './ConfirmationPopup';
import AddPlacePopup from './AddPlacePopup';
import createApiInstance from '../utils/api';


function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [deletedCard, setDeletedCard] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cards, setCards] = useState([]);

  const [currentUser, setCurrentUser] = useState({});

  const [loggedIn, setLoggedIn] = useState(false);
  const [isRegisterRendered, setIsRegisterRendered] = useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [isAuthSuccess, setIsAuthSuccess] = useState(true);
  const [userAccountEmail, setUserAccountEmail] = useState('');
  const [authErrorMessage, setAuthErrorMessage] = useState('');
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');

  const history = useHistory();

  function handleRenderRegister(boolean) {
    setIsRegisterRendered(boolean)
  }

  function handleAccountEmail(email) {
    setUserAccountEmail(email);
  }

  function handleRegister(password, email) {
    auth.register(password, email)
      .then((res) => {
        if (res) {
        setIsAuthSuccess(true);
        history.push('/signin');
        }
      })
      .catch((err) => {
        setIsAuthSuccess(false);
        setAuthErrorMessage(err.message)
      })
      .finally(() => setIsInfoTooltipOpen(true));
  }

  function handleLogin(password, email) {
    auth.authorize(password, email)
      .then(() => setToken(localStorage.getItem('token')))
      .then((data) => {
        checkToken();
      })
      .catch((err) => {
        setIsAuthSuccess(false);
        setAuthErrorMessage(err.message);
        setIsInfoTooltipOpen(true);
      });
  }

  const checkToken = useCallback(() => {
    if (token) {
      auth.getAccountInfo(token)
        .then((res) => {
          if (res) {
            setCurrentUser(res.data);
            handleAccountEmail(res.data.email);
            
            createApiInstance(token).getInitialCards()
              .then((cardData) => {
                setCards(cardData.data);
              })
              .catch((err) => console.log(`Error: ${err.message}`));

            setLoggedIn(true);
          }
        })
        .then(() => {
          history.push('/');
        })
        .catch((err) => {
          console.log(`Error: ${err.message}`);
        });
    }
  }, [history, token]);
  
  useEffect(() => {
    checkToken();
  }, [checkToken]);

  function handleLogout() {
    localStorage.removeItem('token');
    setToken('');
    setLoggedIn(false);
    handleAccountEmail('');
    history.push('/signin');
  }

  function handleUpdateUser({name, about}) {
    setIsLoading(true);
    createApiInstance(token).setUserProfileInfo({name, about})
      .then((editedInfo) => {
        setCurrentUser(editedInfo.data);
      })
      .then(() => closeAllPopups())
      .catch((err) => console.log(`Error: ${err.message}`))
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleUpdateAvatar({avatar}) {
    setIsLoading(true);
    createApiInstance(token).setProfileAvatar({avatar})
      .then((editedInfo) => {
        setCurrentUser(editedInfo.data);
      })
      .then(() => closeAllPopups())
      .catch((err) => console.log(`Error: ${err.message}`))
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleAddPlaceSubmit({name, link}) {
    setIsLoading(true);
    createApiInstance(token).addNewCard({name, link})
      .then((newCard) => {
        setCards([...cards, newCard.data]);
      })
      .then(() => closeAllPopups())
      .catch((err) => console.log(`Error: ${err.message}`))
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((likeInfo) => {
      return likeInfo._id === currentUser._id;
    });

    createApiInstance(token).changeLikeCardStatus(card._id, !isLiked)
      .then((updatedCard) => {
        setCards(cards.map((initialCard) => {
          return initialCard._id === card._id ? updatedCard.data : initialCard
        }));
      })
      .catch((err) => console.log(`Error: ${err.message}`));
  }

  function handleCardDelete(card) {
    setIsLoading(true);
    createApiInstance(token).removeCard(card._id)
      .then(() => {
        setCards(cards.filter((initialCard) => {
          return initialCard._id !== card._id;
        }))
      })
      .then(() => closeAllPopups())
      .catch((err) => console.log(`Error: ${err.message}`))
      .finally(() => {
        setIsLoading(false);
      });
  }

  useEffect(() => {
    const closeByEscape = (e) => {
      if (e.key === 'Escape') {
        closeAllPopups();
      }
    };

    const closeByMouseClick = (e) => {
      if (e.target.classList.contains('modal')) {
        closeAllPopups();
      }
    };

    document.addEventListener('keydown', closeByEscape);
    document.addEventListener('click', closeByMouseClick);

    return () => { 
      document.removeEventListener('keydown', closeByEscape);
      document.removeEventListener('click', closeByMouseClick);
    }
  }, []);

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleCardClick(clickedCard) {
    setSelectedCard(clickedCard);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard(null);
    setIsConfirmationPopupOpen(false);
    setIsInfoTooltipOpen(false);
  }

  function handleRemoveCardClick(card) {
    setIsConfirmationPopupOpen(true);
    setDeletedCard(card);
  }

  return (
    <div className="page__container">
      <CurrentUserContext.Provider value={currentUser}>
        <Header 
          loggedIn={loggedIn} 
          onSignOut={handleLogout} 
          userAccountEmail={userAccountEmail} 
          isRegisterRendered={isRegisterRendered}
        />
        <Switch>
          <ProtectedRoute exact path="/" loggedIn={loggedIn}>
            <Main
              cards={cards}
              onCardLike={handleCardLike}
              onEditProfileClick={handleEditProfileClick}
              onAddPlaceClick={handleAddPlaceClick}
              onEditAvatarClick={handleEditAvatarClick}
              onCardClick={handleCardClick}
              onRemoveBtnClick={handleRemoveCardClick}
            />
            <Footer/>
            <EditProfilePopup
              isOpen={isEditProfilePopupOpen}
              onClose={closeAllPopups}
              onUpdateUser={handleUpdateUser}
              isLoading={isLoading}
            />
            <AddPlacePopup 
              isOpen={isAddPlacePopupOpen}
              onClose={closeAllPopups}
              onAddPlaceSubmit={handleAddPlaceSubmit}
              isLoading={isLoading}
            />
            <ImagePopup card={selectedCard} onClose={closeAllPopups} />
            <EditAvatarPopup 
              isOpen={isEditAvatarPopupOpen}
              onClose={closeAllPopups}
              onUpdateAvatar={handleUpdateAvatar}
              isLoading={isLoading}
            />
            <ConfirmationPopup 
              isOpen={isConfirmationPopupOpen}
              onClose={closeAllPopups}
              card={deletedCard}
              onCardDelete={handleCardDelete}
              isLoading={isLoading}
            />
          </ProtectedRoute>
          <Route path="/signup">
            <Register 
              onRegister={handleRegister} 
              onRenderRegister={handleRenderRegister}
            />
          </Route>
          <Route path="/signin">
            <Login 
              onLogin={handleLogin} 
              onRenderRegister={handleRenderRegister}
            />
          </Route>
          <Route path="*">
            {loggedIn ? <Redirect to="/" /> : <Redirect to="/signin" />}
          </Route>
        </Switch>
        <InfoTooltip 
          isOpen={isInfoTooltipOpen}
          isAuthSuccess={isAuthSuccess}
          authErrorMessage={authErrorMessage}
          onClose={closeAllPopups}
        />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
