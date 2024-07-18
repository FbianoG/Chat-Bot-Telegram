const express = require('express')

const { startTelegramClient } = require('./telegram.js')

const app = express()
const port = 3000

 startTelegramClient()

app.listen(port, () => { console.log(`Servidor funcionando: http://localhost:${port}`) })