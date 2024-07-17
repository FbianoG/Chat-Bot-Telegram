require('dotenv').config()
const Telegraf = require('telegraf')
const fs = require('fs')
const { TelegramClient } = require('telegram')
const { StringSession } = require('telegram/sessions')
const input = require('input')

const apiId = Number(process.env.API_ID)
const apiHash = process.env.API_HASH
const bot = new Telegraf(process.env.BOT_TOKEN)


let stringSession


async function eventTelegram(client, event) {

    try {

        if (!event || !event.message) return

        let events = fs.readFileSync('events.json', 'utf-8')
        let eventsArr = JSON.parse(events)
        eventsArr.push(event)
        fs.writeFileSync('events.json', `${JSON.stringify(eventsArr)}`)

        const msg = event.message

        if (msg.media?.className === 'MessageMediaDocument' && msg.media?.voice) {
            const doc = event.message.media.document;
            const buffer = await client.downloadMedia(doc)
            const tempDocPath = './temp-audio.ogg';
            fs.writeFileSync(tempDocPath, buffer);
            if (!msg.message) await client.sendFile(-4272105154, { file: tempDocPath })
            console.log('Msg com áudio enviada!')
            return
        }

        if (msg.media?.className === 'MessageMediaPhoto') {
            const photo = msg.media.photo;
            const buffer = await client.downloadMedia(photo)
            const tempFilePath = './temp-photo.jpg'
            fs.writeFileSync(tempFilePath, buffer)
            if (msg.message) await client.sendFile(-4272105154, { file: tempFilePath, caption: msg.message })
            if (!msg.message) await client.sendFile(-4272105154, { file: tempFilePath, caption: '' })

            // bot.telegram.sendPhoto(-4272105154, { source: tempFilePath }, { caption: msg.message })
            console.log('Msg com foto enviada!')
            return
        }

        if (msg.message) {
            await client.sendMessage(-4272105154, { message: msg.message })
            // bot.telegram.sendMessage(-4272105154, `${msg.message}`)
            console.log('Msg comum enviada!')
            return
        }

        console.log()
        if (typeof msg === 'string') {
            await client.sendMessage(-4272105154, { message: msg })
            console.log('Msg comum enviada!')
            return
        }

    } catch (error) {
        console.log(error)
    }
}



async function startTelegramClient() {
    try {
        console.log('Carregando cliente...')
        if (fs.existsSync('session.txt')) {
            const savedSession = fs.readFileSync('session.txt', 'utf-8')
            stringSession = new StringSession(savedSession)
        } else {
            stringSession = new StringSession('')
        }
        const client = new TelegramClient(stringSession, apiId, apiHash, {
            connectionRetries: 999,
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
        fs.writeFileSync('session.txt', client.session.save())
        client.addEventHandler(async (event) => eventTelegram(client, event))


    } catch (error) {
        console.log(error)
    }


    // bot.launch()
}


module.exports = { startTelegramClient }

// Grupo = event.message.peerId.chatId.value
//
// Channel = event.message.peerId.channelId.value


