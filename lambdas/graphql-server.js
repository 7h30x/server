const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const graphQLHTTP = require('express-graphql')
const { buildSchema } = require('graphql')
const mongoose = require('mongoose')
const MONGO_URI = process.env.MONGO_URI
console.log(process.env.MONGO_URI,"INI DATABASENYA!!!!")
mongoose.connect(MONGO_URI,{ useNewUrlParser: true })

// graphQL client
const schema =  buildSchema(require('../graphql/schema'))
const resolvers= require('../graphql/root')

//middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))


app.use('/graphql', graphQLHTTP({
    schema,
    rootValue: resolvers,
    graphiql: true
  })
)
module.exports = app