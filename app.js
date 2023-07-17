const express = require("express");
const app = express();
const mongoose = require("mongoose");
const blogModel = require("./models/blog");
const userModel = require("./models/user");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require('dotenv').config()
const methodOverride = require("method-override");
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // console.log("connected");
    let PORT = process.env.PORT_NO || 3000;
    app.listen(PORT); //will start listening
  });

app.set("view engine", "ejs"); //setting the view engine
app.set("views", "views"); //setting the views folder
app.use(express.static("public")); //setting the folder for the static files
app.use(express.urlencoded()); //for form
app.use(cookieParser()); //for ease in setting the cookies
app.use(methodOverride("_method")); //for using delete and others in form

const jwt_secretKey =process.env.JWT_SECRET;
const getToken = (id) => {
  return jwt.sign({ id }, jwt_secretKey);
};
const verifyToken = (token) => {
  return jwt.verify(token, jwt_secretKey);
};

const max = (a, b) => {
  if (b === undefined) return a;
  else return Math.max(a, Number(b));
};
const auth = (
  req,
  res,
  next //for protecting certain routes
) => {
  if (!req.cookies.jwt) {
    res.redirect("/admin-login"); //the token is not present
  } else {
    if (!verifyToken(req.cookies.jwt))
      //not verified
      res.redirect("/admin-login");
    //verified
    else next();
  }
};

app.get("/", async (req, res) => {
  const perPage = 4;
  //   console.log(req.query.page);
  let currPage = max(1, req.query.page);
  //   console.log(currPage);
  const numDocs = await blogModel.count();
  const numPages = Math.ceil(numDocs / perPage);
  //   console.log(numPages);
  let morePages = true;
  if (currPage === numPages) morePages = false;
  const arrBlogs = await blogModel
    .find()
    .sort({ createdAt: -1 })
    .limit(perPage * currPage)
    .exec();
  let blogs = [];
  for (
    let i = perPage * (currPage - 1);
    i < perPage * (currPage - 1) + perPage;
    i++
  ) {
    if (i < arrBlogs.length) blogs.push(arrBlogs[i]);
  }
  res.render("home", { blogs, morePages, currPage });
  //-1 for descending order
  //now we will get the documents and use the concept of pagination
});
app.get("/blog/:id", async (req, res) => {
  const id = req.params.id; //got the id then
  //display this blog
  let blog = await blogModel.findOne({ _id: id });
  res.render("blog", { blog });
});

app.post("/search", (req, res) => {
  let searchWord = req.body.searchWord;
  //now search for the word
  blogModel
    .find({
      $or: [
        { title: { $regex: searchWord, $options: "i" } },
        { body: { $regex: searchWord, $options: "i" } },
      ],
    })
    .then((blogsArr) => {
      res.render("search", { blogs: blogsArr });
    });
});
app.get("/admin-login", async (req, res) => {
  //will get the admin page where we login and get the admin privileages
  let errors = { username: "", password: "" };
  res.render("admin", errors);
});

app.post("/admin-login", (req, res) => {
  // console.log(req.body);
  //got the username and password
  let errors = { username: "", password: "" };
  //will check in the database the password and the username and give access
  userModel.findOne({ username: req.body.username }).then((user) => {
    //got the user here
    //if not found then null in user
    if (!user) {
      errors.username = "No such user exists"; //checked for the user
      res.render("admin", errors);
      return;
    } else {
      //user exists
      //cross check the password
      bcrypt.compare(req.body.password, user.password).then((auth) => {
        if (auth) {
          res.cookie("jwt", getToken(user._id));
          res.redirect("/dashboard");
          return;
        } else {
          errors.password = "Password is incorrect"; //checked for the user
          res.render("admin", errors);
          return;
        }
      });
    }
  });
});
app.get("/logout", auth, (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 }); //delete the cookie/jwt
  res.redirect("/"); //get to home
});
app.get("/dashboard", auth, (req, res) => {
  //will get all the blogs and display along with buttons to edit and delete
  blogModel.find().sort({updatedAt:-1}).then((blogs) => {
    res.render("dashboard", { blogs });
  });
});
app.get("/add-admin", auth, (req, res) => {
  let errors = { username: "", password: "", success: "" };
  res.render("register", errors);
});
app.post("/add-admin", auth, (req, res) => {
  // console.log(req.body);
  //check if this username is already taken if not then register
  let errors = { username: "", password: "", success: "" };
  userModel
    .findOne({ username: req.body.username })
    .then((obj) => {
      if (obj) {
        //username already taken
        errors.username = "Username already registered";
        res.render("register", errors);
      } else {
        return userModel.create({
          username: req.body.username,
          password: req.body.password,
        });
      }
    })
    .then((obj) => {
      errors.success = "User is added!";
      res.render("register", errors);
    });
});
app.delete("/delete/:id", auth, (req, res) => {
  // console.log(req.body);
  // console.log("here");
  // received the request via the form

  //insted of using js and fetch we can use form for the delete,put etc requests
  const id = req.params.id;
  // console.log(id);

  //will remove this blog simply and redirect to the dashboard again
  blogModel.findOneAndDelete({ _id: id }).then(() => {
    //deleted then
    res.redirect("/dashboard");
  });
});
app.get("/edit/:id", auth, (req, res) => {
  const id = req.params.id;
  // console.log(id);
  //getting the edit request then rendering the edit page that sends a patch request later
  blogModel.findOne({ _id: id }).then((blog) => {
    // console.log(blog);
    res.render("edit", { blog });
  });
});
app.patch("/edit/:id", auth, (req, res) => {
  // console.log(req.body);
  // got the patch request here
  const id = req.params.id;
  blogModel
    .findOneAndUpdate(
      { _id: id },
      { title: req.body.title, body: req.body.body,updatedAt:new Date()},
      //updated the updatedAt as well
    )
    .then((obj) => {
      res.redirect("/dashboard");
    });
});
app.get("/contact", (req, res) => {
  let admin = false;
  if (!req.cookies.jwt) {
    admin = false; //the token is not present
  } else {
    if (!verifyToken(req.cookies.jwt)) admin = false;
    //verified
    else {
      admin = true;
    }
  }
  res.render("contact",{admin});

});
app.get("/about", (req, res) => {
  let admin = false;
  if (!req.cookies.jwt) {
    admin = false; //the token is not present
  } else {
    if (!verifyToken(req.cookies.jwt)) admin = false;
    //verified
    else {
      admin = true;
    }
  }
  res.render("about",{admin});

});
app.get("/add-blog",auth,(req,res)=>
{
  res.render("add");
});

app.post("/add-blog",auth,(req,res)=>
{
    // console.log(req.body); 
    blogModel.create({title:req.body.title,body:req.body.body}).then((obj)=>
    {
      res.redirect("/dashboard");
    })
});
