const express = require('express')

const { startTelegramClient } = require('./telegram')

const app = express()
const port = 3001





 startTelegramClient()













app.listen(port, () => { console.log(`Servidor funcionando: http://localhost:${port}`) })