require('dotenv').config()
const Telegraf = require('telegraf')
const fs = require('fs')
const { TelegramClient } = require('telegram')
const { StringSession } = require('telegram/sessions')
const input = require('input')

const chatSendId = process.env.CHAT_SEND_ID 
const apiId = Number(process.env.API_ID)
const apiHash = process.env.API_HASH
const bot = new Telegraf(process.env.BOT_TOKEN)

let stringSession

let events = [{ ServerStart: new Date() }] // List of Client events

// Listen to all events on Telegram
async function eventTelegram(client, event) {

    try {
        if (event.className === 'UpdateUserStatus' && !event.message) return

        const msg = event.message

        events.push(new Date(), msg)

        // Receive documents
        if (msg?.media?.className === 'MessageMediaDocument') {
            const mimeType = msg.media.document.mimeType.split('/')[1]
            const doc = event.message.media.document
            const buffer = await client.downloadMedia(doc)
            const tempDocPath = `./public/documents/temp-doc.${mimeType}`
            fs.writeFileSync(tempDocPath, buffer)
            if (!msg.message) await client.sendFile(chatSendId, { file: tempDocPath }) // messageless
            if (msg.message) await client.sendFile(chatSendId, { file: tempDocPath, caption: msg.message }) // with message
            console.log(`Msg com '${mimeType}' enviada!`)
            return
        }

        // Receive photo
        if (msg?.media?.className === 'MessageMediaPhoto') {
            const photo = msg.media.photo
            const buffer = await client.downloadMedia(photo)
            const tempFilePath = './public/documents/temp-photo.jpg'
            fs.writeFileSync(tempFilePath, buffer)
            if (!msg.message) await client.sendFile(chatSendId, { file: tempFilePath, caption: '' }) // messageless
            if (msg.message) await client.sendFile(chatSendId, { file: tempFilePath, caption: msg.message }) // with message
            console.log('Msg com foto enviada!')
            return
        }

        // Receive common message
        if (msg?.message) {
            await client.sendMessage(chatSendId, { message: msg.message })
            // bot.telegram.sendMessage(chatSendId, `${msg.message}`)
            console.log('Msg comum enviada!')
            return
        }

        // Receive common message (Necessary?)
        if (typeof msg === 'string') {
            await client.sendMessage(chatSendId, { message: msg })
            console.log('Msg comum enviada!')
            return
        }

    } catch (error) {
        console.log(error)
    }
}


// Function to start the Client of Telegram
async function startTelegramClient() {
    try {
        console.log('Loading Client...')
        if (fs.existsSync('./public/keys/session.txt')) {
            const savedSession = fs.readFileSync('./public/keys/session.txt', 'utf-8')
            stringSession = new StringSession(savedSession)
        } else {
            stringSession = new StringSession('')
        }
        const client = new TelegramClient(stringSession, apiId, apiHash, {
            connectionRetries: 9999,
            timeout: 1,
            autoReconnect: true,
        })
        await client.start({
            phoneNumber: async () => await input.text('Por favor, insira seu número de telefone: '),
            password: async () => await input.text('Por favor, insira sua senha: '),
            phoneCode: async () => await input.text('Por favor, insira o código que você recebeu: '),
            onError: (err) => console.log(err),
        })
        console.log('ChatBot is running!')
        fs.writeFileSync('./public/keys/session.txt', client.session.save())
        client.addEventHandler(async (event) => eventTelegram(client, event))
    } catch (error) {
        console.log(error)
    }
    // bot.launch()
}


module.exports = { startTelegramClient, events }