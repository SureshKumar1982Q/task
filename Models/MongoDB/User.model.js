const mongoose = require('mongoose');


var UserSchema = new mongoose.Schema({ ///// User document Schema in users collections
    firstname :{
       type  : String
    },
    lastname :{
       type    :String
    },
});


mongoose.model("User",UserSchema);