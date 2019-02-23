const schema= `
input RegInput {
  email: String!,
  password: String!,
  name: String!,
  gender: String,
  age: Int,
  height: Int
}  
input timbanganInput {
  token: String!, 
  timbanganId: Int! 
}
type UserObj {
  token: String,
  message: String,
  error: String
}
type DataObj {
  token: String,
  message: String,
  error: String,
  data: String
}
type MessageObj {
  message: String,
  error: String
}
type Query {
  hello: String,
  getData(token: String!): DataObj
  signIn(email: String! , password: String! ): UserObj,
}
type Mutation {
    register (input: RegInput!): UserObj,

    addData ( weight : Int!, token: String! ) : MessageObj,
    deleteData( dataId : String! , token: String! ) : MessageObj,
    clearData (token: String! ) : MessageObj,

    addTimb ( input: timbanganInput! ) : MessageObj,
    removeTimb ( input: timbanganInput! ): MessageObj
  }
`

module.exports = schema