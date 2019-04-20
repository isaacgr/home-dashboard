import decode from "jwt-decode";
import jwt from "jsonwebtoken";

class AuthService {
  login(username, password) {
    // Get a token from api server using the fetch api
    const data = {
      username,
      password
    };
    return this.fetch(`/api/login`, {
      method: "POST",
      body: JSON.stringify({
        username,
        password
      })
    })
      .then(res => {
        this.setToken(res.token); // Setting the token in localStorage
        return Promise.resolve(res);
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken(); // Getting token from localstorage
    return !!token && this.isTokenValid(token);

    // return this.isTokenValid(token)
    //   .then(isValid => {
    //     return isValid;
    //   })
    //   .then(result => {
    //     return result;
    //   });
  }

  isTokenValid(token) {
    try {
      return jwt.verify(token, "secretkey", (error, auth) => {
        if (error) {
          return false;
        } else {
          return true;
        }
      });
    } catch (err) {
      return false;
    }
    // try {
    //   return this.fetch("/api/verify", {
    //     method: "POST",
    //     headers: {
    //       Authorization: "Bearer " + this.getToken()
    //     },
    //     body: JSON.stringify({ token })
    //   }).then(response => {
    //     if (response.authorized === true) {
    //       return true;
    //     } else return false;
    //   });
    // } catch (error) {
    //   return false;
    // }
  }

  setToken(idToken) {
    // Saves user token to localStorage
    localStorage.setItem("id_token", idToken);
  }

  getToken() {
    // Retrieves the user token from localStorage
    return localStorage.getItem("id_token");
  }

  logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem("id_token");
  }

  getProfile() {
    // Using jwt-decode npm package to decode the token
    return decode(this.getToken());
  }

  fetch(url, options) {
    // performs api calls sending the required authentication headers
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json"
    };

    return fetch(url, {
      headers,
      ...options
    })
      .then(this._checkStatus)
      .then(response => response.json());
  }

  _checkStatus(response) {
    // raises an error in case response status is not a success
    if (response.status >= 200 && response.status < 300) {
      // Success status lies between 200 to 300
      return response;
    } else {
      let message = "";
      return response.json().then(json => {
        message = json["message"];
        var error = new Error(message);
        error.response = response;
        throw error;
      });
    }
  }
}

let Auth = new AuthService();

export default Auth;
