const schemaString = require('../graphql/schema')
const { makeExecutableSchema, addMockFunctionsToSchema } = require('graphql-tools')
const schema = makeExecutableSchema({ typeDefs: schemaString })
addMockFunctionsToSchema({ schema })
module.exports = schema

