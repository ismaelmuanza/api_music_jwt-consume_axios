const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const MusicController = require('./src/music/MusicController')

// cors
app.use(cors())

// bodyParser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Controller
app.use('/', MusicController)

// SERVIDOR
app.listen(4000, () => console.log('API RODANDO NA PORTA 4000'))