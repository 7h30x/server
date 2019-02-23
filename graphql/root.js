const userController = require('../mongoose/controllers/usergraphQL')
module.exports = {
  signIn: async ({email,password}) => await userController.signIn(email, password),
  register: (input) => userController.register(input),
  getData: async (token) => await userController.getData(token),
  addTimb: async (input) => await userController.addTimbangan(input), //ADD NEW TIMBANGAN ID
  removeTimb: async (input) => await userController.removeTimbangan(input),
  addData: async ({weight, token}) => await userController.addData(weight, token), // ADD BERAT BADAN ENTRY
  deleteData: async ({dataId, token}) => await userController.deleteData( dataId ,token), 
  clearData: async (token) => await userController.clearData(token), //CLEAR ALL USER BB ENTRIES

}