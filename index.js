require('dotenv').config()
const express = require('express')
const { startTelegramClient, events } = require('./public/utils/telegram.js')

const app = express()
const port = process.env.PORT

startTelegramClient()

app.get('/', (req, res) => {
    return res.send(events)
})

app.listen(port, () => { console.log(`Server is running: http://localhost:${port}`) })