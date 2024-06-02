const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

let users = require("./router/auth_users.js").users;
let registered_users = require("./router/auth_users.js").registered_users;

let registered_user = "";

const app = express();

app.use(express.json());

//app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use(session({secret:"fingerpint"},resave=true,saveUninitialized=true));

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
if(req.session.authorization) {
    token = req.session.authorization['accessToken'];
    jwt.verify(token, "access",(err,user)=>{
        if(!err){
            req.user = user;
            next();
        }
        else{
            return res.status(403).json({message: "Customer not authenticated"})
        }
     });
 } else {
     return res.status(403).json({message: "Customer not logged in"})
 }
});

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
    app.post('/login',function (req, res) {
      //Write your code here
    
    // });
    // regd_users.post("/login", (req,res) => {
      //Write your code here
    
      const username = req.body.username;
      const password = req.body.password;
    
      if (!username || !password) {
          return res.status(404).json({message: "Error logging in"});
      }

      if (!isValid(username)) { 
        return res.status(404).json({message: "Customer does not exist"});
      }
    
      if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
          data: password
        }, 'access', { expiresIn: 60 * 60 }); 
        req.session.authorization = {
          accessToken,username
      }
      registered_user = username;
      return res.status(200).send("Customer successfully logged in");
      } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
      }
    
     // return res.status(300).json({message: "Yet to be implemented"});
    });
 
const PORT =5000;

app.use("/customer", customer_routes);

//app.use("/login", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));

module.exports.registered_user = registered_user;