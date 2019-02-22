const userModel = require('../models/user')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

module.exports = class User {
  static verifyJWT(token) {
    return jwt.verify(token, process.env.JWT_SECRET, function (error, decoded) {
      console.log('decode', decoded)
      if (error) {
        return new Error('json web token is not valid.')
      } else {
        return decoded
      }
    })
  }
  static async signIn(email, password) {
    try {
      const userInput = {
        password,
        email
      }
      let user = await userModel.findOne({ email: userInput.email })
      if (user === null) throw 'user not found'
      else {
        let result = await user.checkPassword(userInput.password, user)
        if (result instanceof Error) throw result.message
        else {
          return ({
            message: 'successfully signed in user.',
            token: result,
            userData
          })
        }
      }
    } catch (err) {
      // console.log(err)
      return ({
        error: err
      })
    }
  }
  static async register({input}) {
    try {
      const userInput = {
        name: input.name,
        email: input.email,
        password: input.password,
        age: input.age,
        gender: input.gender
      }
      // console.log('ok')
      let user = await userModel.findOne({ email: userInput.email })
      if (user !== null) throw 'email is already registered.'
      else {
        let newUser = await userModel.create(userInput)
        // console.log("newUser")
        delete newUser.password
        let token = newUser.createToken(newUser)
        return ({
          message: 'successfully registered new user.',
          token
        })  
      }
    } catch (err) {
      // console.log(err)
      return ({
        error: err
      })
    }
  }
  static async getData({token}) {
    let t = token
    try {
      let checkTokenResult = this.verifyJWT(t)
      // console.log('xx',checkTokenResult)
      if (checkTokenResult instanceof Error) throw checkTokenResult
      let result = await userModel.findOne({ email: checkTokenResult.email })
      let userObj = result.toObject()
      delete userObj.password
      let token = jwt.sign(userObj, process.env.JWT_SECRET)
     return ({
        message: 'successfully got user data.',
        token,
        data: JSON.stringify(userObj)
      })
    } catch (err) {
      // console.log(err)
      return ({
        error: String(err)
      })
    }
  } 
  static async addTimbangan({input}) {
    let t = input.token 
    let id = Number(input.timbanganId)
    try {
      let checkTokenResult = this.verifyJWT(t)
      if (checkTokenResult instanceof Error) throw checkTokenResult
      let userObj = await userModel.findOneAndUpdate({
        _id: checkTokenResult._id
      }, {
        $push: {
          timbangans: id
        }
      }, {
        new: true
      })
      let payload= userObj.toObject()
      // console.log(payload)
      return ({
        message: 'successfully added Timbangan with Id: ' + id,
      })
    } catch (err) {
      console.log('error: ', err)
      return ({
        error: String(err)
      })
    }
  }

  static async removeTimbangan ({input}) {
    let t = input.token
    let id = Number(input.timbanganId)
    try {
      let checkTokenResult = this.verifyJWT(t)
      if (checkTokenResult instanceof Error) throw checkTokenResult
      let userObj = await userModel.findOneAndUpdate({
        _id: checkTokenResult._id
      }, {
        $pull: {
          timbangans: id
        }
      }, {
        new: true
      })
      let payload = userObj.toObject()
      console.log('---',payload)
      return ({
        message: 'successfully removed Timbangan with Id: ' + id,
      })
    } catch (err) {
      console.log('error: ', err)
      return ({
        error: String(err)
      })
    }
  }
  static async addData (weight,token) {
    let t = token
    console.log(t)
    try {
      let checkTokenResult = this.verifyJWT(t)
      if (checkTokenResult instanceof Error) throw checkTokenResult
      console.log('zzz')
      let data = { value: Number(weight).toFixed(2), createdAt: new Date(Date.now()) }
      let userObj = await userModel.findOneAndUpdate({
        _id: checkTokenResult._id
      },
      {
        $push: { data: data }
      },
      {
        new: true
      })
      // let payload = userObj.toObject()
      return({
        message: 'updated user weight data.'
      })
    } catch (err) {
      return({
        error: 'error updating data'
      })
    }
  }

  static async deleteData(dataId, token) {
    let t = token
    try {
      let checkTokenResult = this.verifyJWT(t)
      if (checkTokenResult instanceof Error) throw checkTokenResult
      let userObj = await userModel.findOneAndUpdate({
        _id: checkTokenResult._id
      }, {
        $pull: {
          data: { _id: dataId }
        }
      }, {
          new: true
        })
      // let payload = userObj.toObject()
      // delete payload.password
      return ({
        message: 'Successfully deleted user weight data with id:' + dataId
      })
    } catch (err) {
      // console.log('error: ', err)
      return ({
        error: 'error updating data'
      })
    }
  }

  static async clearData({token}) {
    let t = token
    try {
      let checkTokenResult = this.verifyJWT(t)
      if (checkTokenResult instanceof Error) throw checkTokenResult
      let userObj = await userModel.findOneAndUpdate({ _id: checkTokenResult._id },
      {
        $set: { data:[]}
      },
      {
        new: true
      })
      // let payload = userObj.toObject()
      // delete payload.password
      return ({
        message: 'cleared user weight data.'
      })
    } catch (err) {
      // console.log('error: ', err)
      return ({
        error: 'error updating data'
      })
    }
  }
}