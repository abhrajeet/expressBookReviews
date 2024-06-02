const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
let books = require("./booksdb.js");
const regd_users = express.Router();
const registered_user = require("../index.js").registered_user;
let users = [];
let registered_users = "";

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let userswithsamename = users.filter((user)=>{
  return user.username === username
});
if(userswithsamename.length > 0){
  return true;
} else {
  return false;
}
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user)=>{
  return (user.username === username && user.password === password)
});
if(validusers.length > 0){
  return true;
} else {
  return false;
}
}

//only registered users can login
// regd_users.post('/',function (req, res) {
//   //Write your code here

// // });
// // regd_users.post("/login", (req,res) => {
//   //Write your code here

//   const username = req.body.username;
//   const password = req.body.password;

//   if (!username || !password) {
//       return res.status(404).json({message: "Error logging in"});
//   }

//   if (authenticatedUser(username,password)) {
//     let accessToken = jwt.sign({
//       data: password
//     }, 'access', { expiresIn: 60 * 60 });
//      console.log(accessToken); 
//     req.session.authorization = {
//       accessToken,username
//   }
//   return res.status(200).send("Customer successfully logged in");
//   } else {
//     return res.status(208).json({message: "Invalid Login. Check username and password"});
//   }

//  // return res.status(300).json({message: "Yet to be implemented"});
// });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const registeredUserName = req.session.authorization.username;
  const isbn = req.params.isbn;
  let booksArray = Object.values(books);
  let booksISBN = Object.keys(books);
  const review = req.query.review;
  var outputObject = {};
  let bookExists = 0;
  for (var i = 0; i < booksISBN.length; i++) {
    if (booksISBN[i] === isbn) {
      bookExists = 1;
      let booksReviewUser = Object.keys(booksArray[i].reviews);
      let booksReviewUser1 = Object.keys(booksArray[i].reviews);
      let booksAuthor = Object.keys(booksArray[i].author);
      let booksTitle = Object.keys(booksArray[i].title);
      var key = registered_user;
      
      outputObject[key] = [];
      booksReviewUser[registeredUserName] = [];
      // let userregistered = registered_users.filter((registered_user)=>{
      //   return registered_user.username === username
      // });
 //     if(userregistered.length > 0){

        let reviewExists = 0;

        for (var j = 0; j < booksReviewUser.length; j++) {

          if (booksReviewUser[j] === registered_users) {
              reviewExists = 1;
              var data = {
                review: review,
                state: "Edited",
                reviewAuthor : registeredUserName,
                timestamp : new Date()
            };

            booksReviewUser1 = data;
            books[isbn].reviews = booksReviewUser;
            let filteredReviewList = books[isbn].reviews.filter((bookReview)=>{
              return bookReview.reviewAuthor !== registeredUserName
            });
          //    console.log(booksReviewUser1);
            let mergedReviewList = {...filteredReviewList, booksReviewUser1};
            books[isbn].reviews = mergedReviewList;
      //      console.log(booksReviewUser1);
         //   outputObject[key].push(data);
      //    booksReviewUser[registeredUserName].push(data);

      //    var bookData = {
      //     author: booksAuthor,
      //     title: booksTitle,
      //     reviews : booksReviewUser
      // };
      // books[isbn].booksArray.push(bookData);
     // books[isbn].push(bookData);
            break;
          }

       }

       if (reviewExists === 0) {
        var data = {
          review: review,
          state: "Edited",
          reviewAuthor : registeredUserName,
          timestamp : new Date()
      };

      booksReviewUser1 = data;
//      console.log(booksReviewUser1);
       
//       outputObject[key].push(data);
   //    booksReviewUser[registeredUserName].push(data);
     //  console.log(booksReviewUser);
    //    var bookData = {
    //     author: booksAuthor,
    //     title: booksTitle,
    //     reviews : booksReviewUser
    // };
    books[isbn].reviews = booksReviewUser;
    let filteredReviewList = books[isbn].reviews.filter((bookReview)=>{
      return bookReview.reviewAuthor !== registeredUserName
    });
  //    console.log(booksReviewUser1);
    let mergedReviewList = {...filteredReviewList, booksReviewUser1};
    books[isbn].reviews = mergedReviewList;
 //  console.log(mergedReviewList);
   // console.log(books[isbn].reviews);
 //   booksArray[isbn].push(bookData);
   // books[isbn].push(bookData);
       
      // } else {
      //   return res.status(300).json({message: "Customeer is not registered"});
      // }

    };
    
    return res.status(200).json({message: 'The review for the book with ISBN ' + isbn + ' has been added / updated'});
    } 
   }
  
   if (bookExists === 0) {
    return res.status(404).json({message: 'The ISBN does not exist'});
   };

//  return res.status(300).json({message: "Yet to be implemented"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const registeredUserName = req.session.authorization.username;
  const isbn = req.params.isbn;
  let booksArray = Object.values(books);
  let booksISBN = Object.keys(books);
  for (var i = 0; i < booksISBN.length; i++) {
    if (booksISBN[i] === isbn) {
      let reviewKeys = Object.keys(booksArray[i].reviews);
      let reviewValues = Object.values(booksArray[i].reviews);
      console.log(reviewKeys);
      console.log(reviewValues);
      for (var j = 0; j < reviewValues.length; j++) {
        if (reviewValues[j].reviewAuthor === registeredUserName) {
          let filteredReviewKeys = reviewKeys.filter((reviewKey) =>{
            return reviewKey !== reviewKeys[j]
          });
          let filteredReviewValues = reviewKeys.filter((reviewValue) =>{
            return reviewValue !== reviewValues[j]
          });
          }
        }
      }
      break;
    }
  
  return res.status(200).json({message: 'Review for the ISBN 1 posted by the user test deleted.'});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.registered_users = registered_users;
