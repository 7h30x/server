const userModel = require('../models/user')
const mongoose = require('mongoose')
module.exports = class User {
  static async signIn(req, res) {
    try {
      const userInput = {
        password: req.body.password,
        email: req.body.email
      }
      let user = await userModel.findOne({ email: userInput.email })
      if (user === null) throw 'user not found'
      else {
        let result = await user.checkPassword(userInput.password, user)
        if (result instanceof Error) throw result.message
        else {
          res.status(200).json({
            message: 'successfully signed in user.',
            token: result
          })
        }
      }
    } catch (err) {
      console.log(err)
      res.status(400).json({
        error: err
      })
    }
  }
  static async register(req, res) {
    try {
      const userInput = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        age: req.body.age,
        gender: req.body.gender
      }
      let user = await userModel.findOne({ email: req.body.email })
      if (user !== null) throw 'email is already registered.'
      else {
        let newUser = await userModel.create(userInput)
        delete newUser.password
        let token = newUser.createToken(newUser)
        res.status(200).json({
          message: 'successfully registered new user.',
          token
        })  
      }
    } catch (err) {
      // console.log(err)
      res.status(400).json({
        error: err
      })
    }
  }
  static async getData(req, res) {
    try {
      let result = await userModel.findOne({ email: req.decoded.email })
      let userObj = result.toObject()
      delete userObj.password
      let token = newUser.createToken(user)
      res.status(200).json({
        message: 'successfully registered new user.',
        token,
        data: JSON.stringify(userObj)
      })
    } catch (err) {
      // console.log(err)
      res.status(400).json({
        error: 'could not get user data'
      })
    }
  } 
  static async addTimbangan(req, res) {
    console.log('z')
    try {
      let id = Number(req.params.id)
      let userObj = await userModel.findOneAndUpdate({
        _id: req.decoded._id
      }, {
          $push: { timbangans: id }
       }
      )
      let payload = userObj.toObject()
      delete payload.password
      res.status(200).json({
        message: 'updated user timbangans.',
        data: payload
      })
    } catch (err) {
      console.log('error: ', err)
      res.status(400).json({
        error: 'error updating data'
      })
    }
  }

  static async removeTimbangan (req, res) {
    try {
      let id = Number(req.params.id)
      let userObj = await userModel.findOneAndUpdate({
        _id: req.decoded._id
      }, {
          $pull: {
            timbangans: id
          }
        }, {
          new: true
        })
      let payload = userObj.toObject()
      delete payload.password
      res.status(200).json({
        message: 'Successfully deleted user timbangan with id:' + id,
        data: payload
      })
    } catch (err) {
      console.log('error: ', err)
      res.status(400).json({
        error: 'error updating data'
      })
    }
  }
  static async addData (req, res) {
    try {
      let data = { value: Number(req.body.data).toFixed(2), createdAt: new Date(Date.now()) }
      let userObj = await userModel.findOneAndUpdate({
        _id: req.decoded._id
      }, {
        $push: { data: data }
      }, {
          new: true
        })
      let payload = userObj.toObject()
      delete payload.password
      res.status(200).json({
        message: 'updated user weight data.',
        data: payload
      })
    } catch (err) {
      console.log('error: ',err)
      res.status(400).json({
        error: 'error updating data'
      })
    }
  }

  static async deleteData(req, res) {
    try {
      let id = req.params.id 
      let userObj = await userModel.findOneAndUpdate({
        _id: req.decoded._id
      }, {
        $pull: {
          data: { _id: id }
        }
      }, {
          new: true
        })
      let payload = userObj.toObject()
      delete payload.password
      res.status(200).json({
        message: 'Successfully deleted user weight data with id:' + id,
        data: payload
      })
    } catch (err) {
      console.log('error: ', err)
      res.status(400).json({
        error: 'error updating data'
      })
    }
  }

  static async clearData(req, res) {
    try {
      let userObj = await userModel.findOneAndUpdate({ _id: req.decoded._id }, {
        $set: {
          data:[]
        }
      }, {
          new: true
        })
      let payload = userObj.toObject()
      delete payload.password
      res.status(200).json({
        message: 'cleared user weight data.',
        data: payload
      })
    } catch (err) {
      console.log('error: ', err)
      res.status(400).json({
        error: 'error updating data'
      })
    }
  }

}