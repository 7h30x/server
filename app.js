require('dotenv').config()
const PORT = process.env.PORT
const NODE_ENV = process.env.NODE_ENV
const mongoose = require('mongoose')
const graphQLHTTP = require('express-graphql')
const { buildSchema } = require('graphql')

const express = require('express')
// const Router = require('./mongoose/routes')
const bodyParser = require('body-parser')
const MONGO_URI = (NODE_ENV === 'test') ? process.env.MONGO_URI_TEST : process.env.MONGO_URI
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
const schema =  buildSchema(require('./graphql/schema'))
const resolvers= require('./graphql/root')

app.use('/graphql', graphQLHTTP({
    schema,
    rootValue: resolvers,
    graphiql: true
  })
)

app.listen(PORT, () => console.log('graphql server is listening on port:' + PORT) )

//***** REST API Routes
// app.use('/api', Router)

