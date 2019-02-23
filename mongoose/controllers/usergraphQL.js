const userModel = require('../models/user')
const jwt = require('jsonwebtoken')

module.exports = class User {
  static verifyJWT(token) {
    return jwt.verify(token, process.env.JWT_SECRET, function (error, decoded) {
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
            message: 'Successfully signed in user.',
            token: result
          })
        }
      }
    } catch (err) {
      return ({
        error: err
      })
    }
  }
  static async register({ input }) {
    try {
      const userInput = {
        name: input.name,
        email: input.email,
        password: input.password,
        age: input.age,
        gender: input.gender
      }
      let user = await userModel.findOne({ email: userInput.email })
      if (user !== null) throw 'email is already registered.'
      else {
        let newUser = await userModel.create(userInput)
        delete newUser.password
        // console.log("newUser")
        let token = newUser.createToken(newUser)
        return ({
          message: 'Successfully registered new user.',
          token
        })  
      }
    } catch (err) {
      return ({
        error: err
      })
    }
  }
  static async getData({ token }) {
    console.log('hey',token)
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
        message: 'Successfully got user data.',
        token,
        data: JSON.stringify(userObj)
      })
    } catch (err) {
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
      let userObj = await userModel.findOneAndUpdate({_id: checkTokenResult._id}, 
      {
       $push: {timbangans: id}
      },
      {
        new: true
      })
      
      return ({
        message: 'Successfully added Timbangan with Id: ' + id,
      })
    } catch (err) {
      // console.log('error: ', err)
      return ({
        error: 'failed to update user timbangans.'
      })
    }
  }

  static async removeTimbangan ({input}) {
    let t = input.token
    let id = Number(input.timbanganId)
    try {
      let checkTokenResult = this.verifyJWT(t)
      if (checkTokenResult instanceof Error) throw checkTokenResult
      let userObj = await userModel.findOneAndUpdate({ _id: checkTokenResult._id },
      {
        $pull: { timbangans: id }
      },
      {
        new: true
      })
      return ({
        message: 'Successfully removed Timbangan with Id: ' + id,
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
    try {
      let checkTokenResult = this.verifyJWT(t)
      if (checkTokenResult instanceof Error) throw checkTokenResult
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
      let payload = userObj.toObject()
      return ({
        message: 'Successfully updated user weight data.',
        data: payload.data 
      })
    } catch (err) {
      return({
        error: 'error updating data.'
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
      return ({
        message: 'Successfully deleted user weight data with id:' + dataId
      })
    } catch (err) {
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
      return ({
        message: 'Successfully cleared user weight data.'
      })
    } catch (err) {
      return ({
        error: 'error updating data.'
      })
    }
  }
}