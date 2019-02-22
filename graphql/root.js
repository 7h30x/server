const userController = require('../mongoose/controllers/usergraphQL')
module.exports = {
  signIn: ({email,password}) => userController.signIn(email, password),
  register: (input) => userController.register(input),
  getData: (token) => userController.getData(token),
  hello: () => console.log("world"),
  addTimb: (input) => userController.addTimbangan(input), //ADD NEW TIMBANGAN ID
  removeTimb: (input) => userController.removeTimbangan(input),
  addData: ({weight, token}) => userController.addData(weight, token), // ADD BERAT BADAN ENTRY
  deleteData: ({dataId, token}) => userController.deleteData( dataId ,token), 
  clearData: (token) => userController.clearData(token), //CLEAR ALL USER BB ENTRIES

}