
var query = require('../config/query');

async function saveMessage(message) {
    try {
        console.log(message);
        let request = `SELECT code FROM chats WHERE id=${message.channel_id}`;
        query(request, [], (err, rows, result) => {
            if (err) {
                console.log(err);
            }  else {
                let second_request = `INSERT INTO public."${rows[0].code}" (username, message) values('${message.senderName}','${message.text}')`;
                query(second_request, [], (err, rows, result) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        });
    } catch (e) {
        console.log(e)
    }
}

exports.saveMessage = saveMessage;
