module.exports = {
  register: `
    mutation{ 
      register( input: {
                  email:"theo.darmawan2@gmail.com", 
                  password:"123456", 
                  name:"theo"
                }
              ) 
            {
              token,
              error
            }
    }`,

  clearData: `
    mutation {
      clearData(token: "SOME_TOKEN_STRING") {
        message,
        error
      }
    }
    `
}