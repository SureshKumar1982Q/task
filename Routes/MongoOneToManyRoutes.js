const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");     ////////// User Model
const Book = mongoose.model("Book");     ////////// Book Model




router.use(function(req,res,next){
    next();
})



router.route("/adduser").post(async(req,res)=>{    ////////// Add a user to users collection

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

    const userList = await User.find({ firstname: user.firstname });;
    let userID = '';
    if(userList.length != 0) {
        res.status(401).json({status: 401, message: "Duplicate user"})
       return;
    }else{

      const result = await user.save((err,doc)=>{
          if(err){
            console.log(" Error in setting recording ",err);
          }else{
            console.log(" Sucess in setting the record",doc);  
            userID = doc._id.toString();
            res.status(200).json({status: 200, message: `Sucessfully added user, please add books now`});
        }
      });

}

   
});



router.route("/addbook").post(async(req,res)=>{ ///////// Add a book to users collection
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

      let UserID = userList[0]._id.toString();

      const book = new Book();
      book.username = user.firstname + " "+ user.lastname;
      book.book_name = req.body.book_name;
      book.book_auhtorname = req.body.book_auhtorname;
      book.userID = UserID;
      const resultbook = book.save((err,docb)=>{
        if(err){
          console.log(" Error in setting book ",err);
        }else{
          console.log(" Sucess in setting the book");  
          res.status(200).json({status: 200, message: "Sucessfully added book for user "})
        }
    });


    }
});



router.route("/getBooksByUserName").post(async(req,res)=>{ ///////// Get all the books connected to the given user
  
      const user = new User();
      user.firstname = req.body.first;
      user.lastname = req.body.last;
    
    
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

        let strUserID = userList[0]._id.toString();

        
      const book = new Book();
      book.username = user.firstname + " "+ user.lastname;
      book.book_name = req.body.book_name;
      book.userID = strUserID;

      const resultbook = await Book.find({UserID:strUserID});
      console.log(" Result Book of the user is  ",resultbook)
       
      res.status(200).json({status: 200, message: `Found books for ${user.firstname} ${user.lastname}`,data:resultbook});

      }
});




module.exports = router;