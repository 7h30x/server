process.env.NODE_ENV = 'test'
// const app = require('../app')
const { graphql } = require('graphql')
const schema = require('./schema-test')
let chai = require('chai')
var expect = chai.expect
let chaiHttp = require('chai-http')
chai.use(chaiHttp)
const mutations = require('./mutations')
const queries = require('./queries')


describe('/graphQL Schema endpoints return Objects with correct data types', async function () {
 
  it('DATA OBJECT should have correct length and property data types', async function () {
    let { data: { getData : dataObj} } = await graphql(schema, queries.getData)
    expect(dataObj).to.have.property('token').to.be.a('string')
    expect(dataObj).to.have.property('message').to.be.a('string')
    expect(dataObj).to.have.property('error').to.be.a('string')
    expect(dataObj).to.have.property('data').to.be.a('string')
    expect(Object.keys(dataObj)).to.have.length(4)

  })
  it('USER OBJECT should have correct length and property data types', async function () {
    let { data: { signIn:  userObj  } } = await graphql(schema, queries.signIn)
    expect(userObj).to.have.property('token').to.be.a('string')
    expect(userObj).to.have.property('message').to.be.a('string')
    expect(userObj).to.have.property('error').to.be.a('string')
    expect(Object.keys(userObj)).to.have.length(3)

  })
  it('MESSAGE OBJECT TYPE should have correct length and property data types', async function () {
    let { data: {clearData: messageObj} } = await graphql(schema, mutations.clearData)
    expect(messageObj).to.have.property('message').to.be.a('string')
    expect(messageObj).to.have.property('error').to.be.a('string')
    expect(Object.keys(messageObj)).to.have.length(2)

  })
})
