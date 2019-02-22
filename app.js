require('dotenv').config()
const mongoose = require('mongoose')
const graphQL = require('graphql')
const express = require('express')
const Router = require('./mongoose/routes')
const bodyParser = require('body-parser')
const MONGO_URI = process.env.MONGO_URI
const PORT = process.env.PORT
const app = express()
//set up mongoose DB
mongoose.connect(MONGO_URI)
const db = mongoose.connection
db.on('open', () => {
  console.log('connected to mongo DB')
})

//middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

// graphQL client

//Routes
app.use('/api', Router)

app.listen(PORT, )
