const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");

 ///////////////////// CRUD operation shown below ////////////////////////////////


router.use(function(req,res,next){
   
    next();
})



router.route("/adduser").post(async(req,res)=>{  ///////// Add a user to users collection

    const user = new User();
    user.firstname = req.body.first;
    user.lastname = req.body.last;
    
    console.log(" Result ",user.firstname);

    if(user.firstname === '' || user.firstname === undefined){
      res.status(400).json({status: 400, message: "First name is required"})
      return;
    }

    if(user.lastname === '' || user.lastname === undefined){
      res.status(400).json({status: 400, message: "Second name is required"})
      return;
    }

    const userList = await User.find({ firstname: user.firstname });

    if(userList.length != 0) {
        res.status(401).json({status: 401, message: "Duplicate user"})
       return;
    }

    const result = await user.save((err,doc)=>{
        if(err){
          console.log(" Error in setting recording ",err);
        }else{
          console.log(" Sucess in setting the record");  
          res.status(200).json({status: 200, message: "Sucessfully added user"})
        }
         
    });
    console.log(" Result ",result);
});



router.route("/getuser").post(async(req,res)=>{   ///////// get user
    const user = new User(); 
    user.firstname = req.body.first;
    user.lastname = req.body.last;
    
    console.log(" Result ",user.firstname);

    if(user.firstname === '' || user.firstname === undefined){
      res.status(400).json({status: 400, message: "First name is required"})
      return;
    }

    if(user.lastname === '' || user.lastname === undefined){
      res.status(400).json({status: 400, message: "Second name is required"})
      return;
    }

    const userList = await User.find({ firstname: user.firstname });

    if(userList.length != 0) {
        res.status(200).json({status: 200, message: `user found first name is ${user.firstname} and last name is ${user.lastname}`});
       return;
    }
});



router.route("/updateuser").post(async(req,res)=>{  ///////// update user 
    const user = new User();
    user.firstname = req.body.first;
    user.lastname = req.body.last;
    
    console.log(" Result ",user.firstname);

    if(user.firstname === '' || user.firstname === undefined){
      res.status(400).json({status: 400, message: "First name is required"})
      return;
    }

    if(user.lastname === '' || user.lastname === undefined){
      res.status(400).json({status: 400, message: "Second name is required"})
      return;
    }


    const userFoundList = await User.find({ firstname: user.firstname });

    if(userFoundList.length == 0) {
        res.status(400).json({status: 400, message: `user not found`});
       return;
    }

    const userList = await User.updateOne({ firstname: user.firstname,lastname:user.lastname });

    console.log(" userList ",userList);

    if(userList.acknowledged === true){
        res.status(200).json({status: 200, message: "User updated sucessfully"});
    }
});



router.route("/deleteuser").post(async(req,res)=>{   ///////// delete a  user
    const user = new User();
    user.firstname = req.body.first;
    user.lastname = req.body.last;
    
    console.log(" Result ",user.firstname);

    if(user.firstname === '' || user.firstname === undefined){
      res.status(400).json({status: 400, message: "First name is required"})
      return;
    }

    if(user.lastname === '' || user.lastname === undefined){
      res.status(400).json({status: 400, message: "Second name is required"})
      return;
    }


    const userFoundList = await User.find({ firstname: user.firstname });

    if(userFoundList.length == 0) {
        res.status(400).json({status: 400, message: `user not found`});
       return;
    }

    const userList = await User.deleteOne({ firstname: user.firstname,lastname:user.lastname });

    console.log(" userList ",userList);

    if(userList.acknowledged === true){
        res.status(200).json({status: 200, message: "User deleted sucessfully"});
    }
});


module.exports = router;