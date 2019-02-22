const Router = require('express').Router()
const{ verifyJWT} = require('../middlewares/verifyJWT')
const userController = require('../controllers/user')


Router.post('/signIn', userController.signIn)
Router.post('/register', userController.register)
// Router.put('/editUserProfile/:userId', verifyJWT, userController.editProfile)

// Router.put('/addTimbangan/:timbanganId', userController.addTimbangan)
// Router.delete('/removeTimbangan/:timbanganId', userController.removeTimbangan)

Router.put('/addData', verifyJWT, userController.addData)
Router.delete('/deleteData/:id', verifyJWT, userController.deleteData)
Router.delete('/clearData', verifyJWT, userController.clearData)

module.exports = Router


