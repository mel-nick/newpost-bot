const TelegramBot = require('node-telegram-bot-api');
const config = require('./config.json');
const axios = require('axios')

const token = config.token;
const bot = new TelegramBot(token, {
  polling: true,
  filepath: false
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  axios.post('https://api.novaposhta.ua/v2.0/json/', {
      "apiKey": "8f0c6387a0ee700ede5bb158c26ff98f",
      "modelName": "TrackingDocument",
      "calledMethod": "getStatusDocuments",
      "methodProperties": {
        "Documents": [{
          "DocumentNumber": `${msg.text}`
        }]
      }
    })
    .then(res => {
      console.log(res.data)
      let parcellData = res.data.data[0]
      const botResponse = parcellData.WarehouseRecipient && parcellData.AmountToPay ? `
*${parcellData.Status}*  
*маршрут:* ${parcellData.CitySender} --> ${parcellData.CityRecipient}
${parcellData.WarehouseRecipient}
до сплати: ${parcellData.AmountToPay}` : `_${parcellData.Status}_`
      bot.sendMessage(chatId, botResponse, {
        parse_mode: 'markdown'
      })
    })
    .catch(error => console.error(error));
});