import axios from "axios";

const API_URL = "http://localhost:8080/user/";

class AuthService {
  login(Email, Password) {
    return axios
      .post(API_URL + "login", {
        Email,
        Password
      })
      .then(response => {

        localStorage.setItem("user", JSON.stringify(response.data));
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(username, email, password) {
    return axios.post(API_URL + "register", {
      username,
      email,
      password
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}

export default new AuthService();