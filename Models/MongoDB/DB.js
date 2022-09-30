const mongoose = require('mongoose');
const user = process.env.user   /// UserName
const pass = process.env.pass   /// Password
const url = `mongodb+srv://${user}:${pass}@cluster0.sienncp.mongodb.net/SureshKumar_task`; //////// Mongo DB cloud database connect url

mongoose.connect(url, {                               ////// Connect to Mongo Database
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(console.log('connected to mongo Database'))
.catch(err => console.log(`error: ${err}`))


require("./User.model");     //////// import User Model
require("./Book.model");     ///////  import Book Model