# chat2desk-node
Chat2Desk Client for node js

Пример получения сообщений:
```js
const Chat2DeskClient = require('../lib/chat2deskClient');

const TOKEN = process.env.TOKEN;

const chat2DeskClient = new Chat2DeskClient(TOKEN);

chat2DeskClient.GetMessages(0, 50)
    .then(response => {
        let messages = response.data;
        for (let message of messages) {
            console.log(`text: ${message.text}, date: ${message.created}, transport: ${message.transport}`)
        }
    }).catch(error => console.log(error));
```
