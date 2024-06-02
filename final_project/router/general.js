const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

// const authenticatedUser = (username,password)=>{
//   let validusers = users.filter((user)=>{
//     return (user.username === username && user.password === password)
//   });
//   if(validusers.length > 0){
//     return true;
//   } else {
//     return false;
//   }
// }


public_users.post("/register", (req,res) => {
  //Write your code here

  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "Customer successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "Customer already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register customer."});
  
 // return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify(books,null,4));
//  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  return res.status(200).send(books[isbn]);
//  return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  let booksArray = Object.values(books);
  let booksISBN = Object.keys(books);

  var outputObject = {};
  var key = 'booksbyauthor';
  outputObject[key] = [];
 for (var i = 0; i < booksArray.length; i++) {
  if (booksArray[i].author === author) {
    var data = {
      isbn: booksISBN[i],
      title: booksArray[i].title,
      reviews : booksArray[i].reviews
  };
  outputObject[key].push(data);
  }
 }
  return res.status(200).send(JSON.stringify(outputObject));
// return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  let booksArray = Object.values(books);
  let booksISBN = Object.keys(books);

  var outputObject = {};
  var key = 'booksbyauthor';
  outputObject[key] = [];
 for (var i = 0; i < booksArray.length; i++) {
  if (booksArray[i].title === title) {
    var data = {
      isbn: booksISBN[i],
      title: booksArray[i].title,
      reviews : booksArray[i].reviews
  };
  outputObject[key].push(data);
  }
 }
  return res.status(200).send(JSON.stringify(outputObject));
 // return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let booksArray = Object.values(books);
  let booksISBN = Object.keys(books);

 for (var i = 0; i < booksISBN.length; i++) {
  if (booksISBN[i] === isbn) {
var bookReview = booksArray[i].reviews;
break;
  }
 }
  return res.status(200).send(bookReview);
 // return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
