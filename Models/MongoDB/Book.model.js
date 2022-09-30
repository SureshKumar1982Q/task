const mongoose = require('mongoose');


var BookSchema = new mongoose.Schema({  //// Book document schema in books collection
    username :{
       type  : String
    },
    book_name:{
        type:String
     },
     book_auhtorname:{
       type:String
     },
    userID :{
       type    :String
    }
    
});


mongoose.model("Book",BookSchema);