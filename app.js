require('dotenv').config()
const mongoose = require('mongoose')
const graphQLHTTP = require('express-graphql')
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
const schema = require('./graphql/schema')
const root = require('./graphql/root')

app.use('/graphql', graphQLHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
)


//Routes
// app.use('/api', Router)

app.listen(PORT, () => console.log('graphql server is listening on port:' + PORT) )
