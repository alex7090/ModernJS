import axios from "axios";

const API_URL = `http://localhost:8080/chat`;

class ChatService {
  fetch(id) {
    return axios
      .get(API_URL+ `?id=${id}`)
      .then(response => {
        return response.data;
      });
  }

  create(Name, Admin) {
    return axios.post(API_URL + "/create", {
      Name,
      Admin
    });
  }

  invite(mail, channel_id) {
    return axios.post(API_URL + "/invite", {
      mail,
      channel_id
    });
  }
}

export default new ChatService();