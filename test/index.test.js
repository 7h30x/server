//During the test the env variable is set to test
process.env.NODE_ENV = 'test'
const app = require('../app')
const jwt = require('jsonwebtoken')
let User = require('../mongoose/models/user')
const graphql = require('graphql')
//Require the dev-dependencies
const resolvers = require('../graphql/root')
let chai = require('chai')
let chaiHttp = require('chai-http')
let expect = chai.expect
chai.use(chaiHttp)

var registerInputSuccess = {
  input: {
    name: 'jhonny',
    email: 'johno@email.com',
    password: '123456',
    age: 20,
    gender: 'male'
  }
}
var signInInputSuccess = {
  email: 'johno@email.com',
  password: '123456'
}
function clearDB() {
  User.deleteMany()
    .then(res => {
    console.log('deleted users from DB')
  })
}

describe('GET /graphQL', function () {
  this.timeout(10000)
  context ('USER REGISTER', function () {
    it('should return object with success message, logged in user token', async function(){
      var resultObj = await resolvers.register(registerInputSuccess)
        expect(resultObj).to.be.an('Object')
        expect(resultObj).to.have.property('message')
        expect(resultObj.message).to.equal('Successfully registered new user.')
        expect(resultObj.token).to.be.a('string')
        expect(Object.keys(resultObj)).to.have.length(2)
    })
    it('it should return object with error property with type String on invalid user email', async function() {
      var registerInputFail = JSON.parse(JSON.stringify(registerInputSuccess))
      registerInputFail.input.email = 'blabla'
      var resultObj = await resolvers.register(registerInputFail)
      expect(resultObj).to.be.an('Object')
      expect(resultObj).to.have.property('error')
      expect(resultObj.error).to.be.instanceOf(Error)
    })
    afterEach(clearDB)
  })
  context('USER SIGN IN',  function () {
    before(function createDBUser(done) {
      console.log('creating user', registerInputSuccess.input)
      User.create(registerInputSuccess.input)
        .then(res => {
          console.log('created new user')
          done()
        })
    })
      it('should return object with success message, logged in user token', async function () {
        var resultObj = await resolvers.signIn(signInInputSuccess)
        console.log('----->>', resultObj)
        expect(resultObj).to.be.an('Object')
        expect(resultObj).to.have.property('message')
        expect(resultObj.message).to.equal('Successfully signed in user.')
        expect(resultObj.token).to.be.a('string')
        expect(Object.keys(resultObj)).to.have.length(2)
      })
      it('it should return object with error property with type String if invalid user password', async function () {
        var inputFail = JSON.parse(JSON.stringify(signInInputSuccess))
        inputFail.password = 'wrongpass'
        var resultObj = await resolvers.signIn(inputFail)
        expect(resultObj).to.be.an('Object')
        expect(resultObj).to.have.property('error')
        expect(resultObj.error).to.equal('wrong username / password')
        expect(Object.keys(resultObj)).to.have.length(1)
      })
      it('it should return object with error property with type String if input email not registered', async function () {
        var inputFail = JSON.parse(JSON.stringify(signInInputSuccess))
        inputFail.email = 'notregistered@xxx.com'
        var resultObj = await resolvers.signIn(inputFail)
        expect(resultObj).to.be.an('Object')
        expect(resultObj).to.have.property('error')
        expect(resultObj.error).to.equal('user not found')
        expect(Object.keys(resultObj)).to.have.length(1)
      })
    
      after(clearDB)
  })
  context ('GET DATA', function () {
    var token;
    before(function (done) {
      User.create(registerInputSuccess.input)
        .then(user => {
          token = { token: jwt.sign(user.toObject(), process.env.JWT_SECRET) }
        done()
      })
    })

    it('it should return object with success message, user token, and data property with type JSON', async function () {
      var resultObj = await resolvers.getData(token)
      console.log(resultObj)
      expect(resultObj).to.be.an('Object')
      expect(resultObj).to.have.property('message')
      expect(resultObj.message).to.equal('Successfully got user data.')
      expect(resultObj.token).to.be.a('string')
      expect(JSON.parse(resultObj.data)).to.be.a('object')
      expect(Object.keys(resultObj)).to.have.length(3)

    })
    it('it should return error object on no/ invalid token', async function () {
      var resultObj = await resolvers.getData({ token: 'faketoken' })
      expect(resultObj).to.be.an('Object')
      expect(resultObj).to.have.property('error')
      expect(resultObj.error).to.equal('Error: json web token is not valid.')
    })
    after(clearDB)

  })
  context('EDIT TARGET', function() {
    var tokenObj
    var weight = 70
    var daysSuccess = 7
    var daysFail = 6
    before(function (done) {
      User.create(registerInputSuccess.input)
        .then(user => {
          tokenObj = { token: jwt.sign(user.toObject(), process.env.JWT_SECRET) }
          done()
        })
    })
    it('should return object with success message and data object', async function () {
      var resultObj = await resolvers.editTarget({
        weight,
        days: daysSuccess,
        token: tokenObj.token
      })  
      expect(resultObj).to.be.an('Object')
      expect(resultObj).to.have.property('message')
      expect(resultObj.message).to.equal('Successfully updated user targets.')
      expect(resultObj).to.have.property('data')
      expect(JSON.parse(resultObj.data)).to.be.an('object')
      expect(JSON.parse(resultObj.data)).to.have.property('weight')
      expect(Object.keys(resultObj)).to.have.length(2)
    })
    it('should return error message on days < 7 days ( 1 week )', async function () {
      var resultObj = await resolvers.editTarget({
        weight,
        days: daysFail,
        token: tokenObj.token
      })
      expect(resultObj).to.be.an('Object')
      expect(resultObj).to.have.property('error')
      expect(resultObj.error).to.equal('error updating user targets.')
      expect(Object.keys(resultObj)).to.have.length(1)
    })
    after(clearDB)
  })
  context ('EDIT HEIGHT', function () {
    var tokenObj
    var heightSuccess = 170
    var heightFail = 'xxx'
    before(function (done) {
      User.create(registerInputSuccess.input)
        .then(user => {
          tokenObj = { token: jwt.sign(user.toObject(), process.env.JWT_SECRET) }
          done()
        })
    })
    it('should return object with success message and data object', async function () {
      var resultObj = await resolvers.editHeight({
        height: heightSuccess,
        token: tokenObj.token
      })
      expect(resultObj).to.be.an('Object')
      expect(resultObj).to.have.property('message')
      expect(resultObj.message).to.equal('Successfully updated user height to: ' + heightSuccess)
      expect(Object.keys(resultObj)).to.have.length(1)
    })
    it('should return error message on invalid height', async function () {
      var resultObj = await resolvers.editHeight({
        height: heightFail,
        token: tokenObj.token
      })
      expect(resultObj).to.be.an('Object')
      expect(resultObj).to.have.property('error')
      expect(resultObj.error).to.equal('error updating height.')
      expect(Object.keys(resultObj)).to.have.length(1)
    })
    after(clearDB)
  })
  context ('CLEAR DATA', function () {
    var tokenObj
    var weight = 60
    
    before(function (done) {
      User.create(registerInputSuccess.input)
      .then(user => {
        tokenObj = { token: jwt.sign(user.toObject(), process.env.JWT_SECRET) }
        return resolvers.addData({ weight, token: tokenObj })
      })
      .then(() => done())
    })

    it('it should return object with success message', async function () {
      var resultObj = await resolvers.clearData( tokenObj )
      expect(resultObj).to.be.an('Object')
      expect(resultObj).to.have.property('message')
      expect(resultObj.message).to.equal('Successfully cleared user weight data.')
      expect(Object.keys(resultObj)).to.have.length(1)
    })
    it('it should return error object on no/ invalid token', async function () {
      var resultObj = await resolvers.clearData({token: 'xxx'} )
      expect(resultObj).to.be.an('Object')
      expect(resultObj).to.have.property('error')
      expect(resultObj.error).to.equal('error updating data.')
    })
    after(clearDB)
  })
  context ('DELETE DATA', function () {
    var token
    var weight = 60
    var weightFalse = 'xxx'
    var dataId
    before(function (done) {
      User.create(registerInputSuccess.input)
      .then(user => {
        token = jwt.sign(user.toObject(), process.env.JWT_SECRET)
        return resolvers.addData({weight, token})
      })
      .then(resultObj => {
        dataId = resultObj.data[0]._id
        done()
      })
    })
    it('it should return object with success message', async function () {
      var resultObj = await resolvers.deleteData({ dataId, token })
      expect(resultObj).to.be.an('Object')
      expect(resultObj).to.have.property('message')
      expect(resultObj.message).to.equal('Successfully deleted user weight data with id:' + dataId)
    })
    it('it should return error object on no/ invalid token', async function () {
      var resultObj = await resolvers.addData({ dataId, token: 'faketoken' })
      expect(resultObj).to.be.an('Object')
      expect(resultObj).to.have.property('error')
      expect(resultObj.error).to.equal('error updating data.')
    })
    it('it should return error object on dataId not valid', async function () {
      var resultObj = await resolvers.addData({ dataId: 'xxx', token })
      expect(resultObj).to.be.an('Object')
      expect(resultObj).to.have.property('error')
      expect(resultObj.error).to.equal('error updating data.')
    })
    after(clearDB)
  })
  context ('ADD DATA', function () {
    var token
    var weight = 60
    var weightFalse = 'xxx'
    before(function (done) {
      User.create(registerInputSuccess.input)
        .then(user => {
          token = jwt.sign(user.toObject(), process.env.JWT_SECRET)
          done()
        })
    })
    it('it should return object with success message', async function () {
      var resultObj = await resolvers.addData({ weight, token })
      console.log(resultObj)
      expect(resultObj).to.be.an('Object')
      expect(resultObj).to.have.property('message')
      expect(resultObj).to.have.property('data')
      expect(resultObj.data).to.be.an('array')
      expect(resultObj.message).to.equal('Successfully updated user weight data.')
    })
    it('it should return error object on no/ invalid token', async function () {
      var resultObj = await resolvers.addData({ weight, token: 'faketoken' })
      expect(resultObj).to.be.an('Object')
      expect(resultObj).to.have.property('error')
      expect(resultObj.error).to.equal('error updating data.')
    })
    it('it should return error object on weight not valid Number', async function () {
      var resultObj = await resolvers.addData({ weightFalse, token })
      expect(resultObj).to.be.an('Object')
      expect(resultObj).to.have.property('error')
      expect(resultObj.error).to.equal('error updating data.')
    })
    after(clearDB)
  })
  context ('ADD TIMBANGAN', function () {
    before(function (done) {
      User.create(registerInputSuccess.input)
        .then(user => {
          token = jwt.sign(user.toObject(), process.env.JWT_SECRET)
          done()
      })
    })
    it('should return object with success message', async function () {
      var id = 1
      var resultObj = await resolvers.addTimb({ input: { token,  timbanganId: id } })
      expect(resultObj).to.be.an('Object')
      expect(resultObj).to.have.property('message')
      expect(resultObj.message).to.equal('Successfully added Timbangan with Id: '+id)
    })
    it('it should return error object on no/ invalid token', async function () {
      var id = 1
      var resultObj = await resolvers.addTimb({ input: { token: 'xxx', timbanganId: id } })
      expect(resultObj).to.be.an('Object')
      expect(resultObj).to.have.property('error')
      expect(resultObj.error).to.equal('failed to update user timbangans.')
    })
    it('should return object with error message on Id not a number', async function () {
      var id = 'xxx'
      var resultObj = await resolvers.addTimb({ input: { token, timbanganId: id } })
      expect(resultObj).to.be.an('Object')
      expect(resultObj).to.have.property('error')
      expect(resultObj.error).to.equal('failed to update user timbangans.')
    })
    after(clearDB)
  })
  context ('REMOVE TIMBANGAN', function () {
    before(function (done) {
      User.create(registerInputSuccess.input)
        .then(user => {
          token = jwt.sign(user.toObject(), process.env.JWT_SECRET)
          return resolvers.addTimb({ input: { token, timbanganid: 1 } })
        })
        .then(() => done())
    })
    it('should return object with success message', async function () {
      var id = 1
      var resultObj = await resolvers.removeTimb({ input: { token, timbanganId: id } })
      expect(resultObj).to.be.an('Object')
      expect(resultObj).to.have.property('message')
      expect(resultObj.message).to.equal('Successfully removed Timbangan with Id: 1')
    })
    it('it should return error object on no/ invalid token', async function () {
      var id = 1
      var resultObj = await resolvers.addTimb({ input: { token: 'xxx', timbanganId: id } })
      expect(resultObj).to.be.an('Object')
      expect(resultObj).to.have.property('error')
      expect(resultObj.error).to.equal('failed to update user timbangans.')
    })
    it('should return object with error message on Id not number', async function () {
      var id = 'xxx'
      var resultObj = await resolvers.addTimb({ input: { token, timbanganId: id } })
      expect(resultObj).to.be.an('Object')
      expect(resultObj).to.have.property('error')
      expect(resultObj.error).to.equal('failed to update user timbangans.')
    })
    after(clearDB)
  })
})

