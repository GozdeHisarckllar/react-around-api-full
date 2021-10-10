class Api {
    constructor({baseUrl, headers}) {
      this._baseUrl = baseUrl;
      this._headers = headers;
    }
    
    _handleResponse(res) {
      if (res.ok) {
        return res.json();
      }
  
      return res.json()
      .then((res) => { 
        throw new Error(res.message);
      });
    }
  
    getUserInfo() {
      return fetch(`${this._baseUrl}/users/me`, { 
          headers: this._headers
        }
      )
      .then(this._handleResponse);
    }
  
    getInitialCards() {
      return fetch(`${this._baseUrl}/cards`, { 
          headers: this._headers
        }
      )
      .then(this._handleResponse);
    }
    
    setProfileAvatar({avatar}) {
      return fetch(`${this._baseUrl}/users/me/avatar`, {
          method: "PATCH",
          headers: this._headers,
          body: JSON.stringify({
            avatar: avatar
          })
        }
      )
      .then(this._handleResponse);
    }
  
    setUserProfileInfo({name, about}) {
      return fetch(`${this._baseUrl}/users/me`, {
          method: "PATCH",
          headers: this._headers,
          body: JSON.stringify({
            name: name,
            about: about
          })
        }
      )
      .then(this._handleResponse);
    }
  
    addNewCard({name, link}) {
      return fetch(`${this._baseUrl}/cards`, {
          method: "POST",
          headers: this._headers,
          body: JSON.stringify({
            name: name,
            link: link
          })
        }
      )
      .then(this._handleResponse);
    }
  
    removeCard(cardId) {
      return fetch(`${this._baseUrl}/cards/${cardId}`, {
          method: "DELETE",
          headers: this._headers,
        }
      )
      .then(this._handleResponse);
    }
  
    changeLikeCardStatus(cardId, isNotLiked) {
      if (isNotLiked) {
        return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
            method: "PUT",
            headers: this._headers,
          }
        )
        .then(this._handleResponse);
      } else {
        return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
            method: "DELETE",
            headers: this._headers,
          }
        )
        .then(this._handleResponse);
      }
    }
  }
  
  const createApiInstance = (token) => {
    return new Api({
      baseUrl: "https://api.around.app.students.nomoreparties.site",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${token}`
      }});
  };

  export default createApiInstance;