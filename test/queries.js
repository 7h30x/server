module.exports = {
  getData: `
            query{
              getData(token: "SOME_TOKEN_STRING") {
                token,
                message,
                error,
                data
              }
            }`,
  signIn: `
          query {
            signIn (email: "xxx", password: "xxx" ) {
                token,
                message,
                error
              }
          }`
}
