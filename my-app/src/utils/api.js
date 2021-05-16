import axios from "axios";
const headers = {
    "Content-Type": "application/json"
};
const url = "http://localhost:8080";

export default {
    createEntry: function (firstName, lastName, phoneNumber) {
        console.log("Creating a new entry");
        return axios.post(
            `${url}/phonebook`,{
                firstName: firstName,
                lastName: lastName,
                phoneNumber: phoneNumber
              }
            ,
            {
                headers: headers
            }
        );
    },
    getEntries: function () {
        return axios.get(`${url}/phonebook`, { headers: headers });
    },
    updateEntry: function (id, firstName, lastName, phoneNumber) {
        console.log("Edit")
        return axios.post(
            `${url}/phonebook`,{
                id: id,
                firstName: firstName,
                lastName: lastName,
                phoneNumber: phoneNumber
              }
            ,
            {
                headers: headers
            }
        );
    }
};