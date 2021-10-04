class Api {
    constructor({baseUrl, headers}) {
      this._baseUrl = baseUrl;
      this._headers = headers;
    }
    
    _handleResponse(res) {
      if (res.ok) {
        return res.json();
      }
  
      return Promise.reject(res.status);
    }
  
    getUserInfo() {
      return fetch(`${this._baseUrl}/users/me`, { 
          headers: this._headers
        }
      )
      .then(this._handleResponse);
    }
    /*getUserInfo(token) {
      return fetch(this._baseUrl + "/users/me", { 
          headers: {
            authorization: token,
            "Content-Type": "application/json"
          }
        }
      )
      .then(this._handleResponse);
    }*/
  
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
        return fetch(`${this._baseUrl}/cards/${cardId}/likes`, { // fetch(this._baseUrl + "/cards/likes/" + cardId,
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
  }// all of them need authorization:token
  //function(token ) => return new Api(baseurl, token) func(token).getAllCards
  const createApiInstance = (token) => {
    return new Api({
      baseUrl: "http://localhost:3001",// auth token is not compatible with this api "https://around.nomoreparties.co/v1/group-12"
      headers: {
         mode:'no-cors',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${token}`
      }});
  };
/*authorization: token,
        "Content-Type": "application/json"*/
  export default createApiInstance;

  /*1 const api = new Api({
    baseUrl: "https://.domainaround.nomoreparties.co/v1",
    }); */ // getAull(token)

 /*2 export default createApiInstance = (token) => {
   return new Api({
    baseUrl: "https://.domainaround.nomoreparties.co/v1",
    headers: {
      authorization: token,
      "Content-Type": "application/json"
    }});
 } */ //createApiInstance.getAll()