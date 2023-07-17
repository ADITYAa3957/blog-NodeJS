const blogModel = require("../models/blog");
const userModel = require("../models/user");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const { max, auth, getToken, verifyToken } = require("../utils.js");
const getLoginAdmin = async (req, res) => {
  //will get the admin page where we login and get the admin privileages
  let errors = { username: "", password: "" };
  res.render("admin", errors);
};
const loginAdmin = (req, res) => {
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
};
const adminLogout = (req, res) => {
  // res.cookie("jwt",, { maxAge: 1 }); //delete the cookie/jwt
  res.clearCookie("jwt");
  res.redirect("/"); //get to home
};
const getDashboard = (req, res) => {
  //will get all the blogs and display along with buttons to edit and delete
  blogModel
    .find()
    .sort({ updatedAt: -1 })
    .then((blogs) => {
      res.render("dashboard", { blogs });
    });
};
const getAddAdmin = (req, res) => {
  let errors = { username: "", password: "", success: "" };
  res.render("register", errors);
};
const addAdmin = (req, res) => {
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
};
const deleteBlog = (req, res) => {
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
};
const getEditBlog = (req, res) => {
  const id = req.params.id;
  // console.log(id);
  //getting the edit request then rendering the edit page that sends a patch request later
  blogModel.findOne({ _id: id }).then((blog) => {
    // console.log(blog);
    res.render("edit", { blog });
  });
};

const editBlog = (req, res) => {
  // console.log(req.body);
  // got the patch request here
  const id = req.params.id;
  blogModel
    .findOneAndUpdate(
      { _id: id },
      { title: req.body.title, body: req.body.body, updatedAt: new Date() }
      //updated the updatedAt as well
    )
    .then((obj) => {
      res.redirect("/dashboard");
    });
};
const getAddBlog = (req, res) => {
  res.render("add");
};
const addBlog = (req, res) => {
  // console.log(req.body);
  blogModel
    .create({ title: req.body.title, body: req.body.body })
    .then((obj) => {
      res.redirect("/dashboard");
    });
};
module.exports = {
  getLoginAdmin,
  loginAdmin,
  adminLogout,
  getDashboard,
  getAddAdmin,
  addAdmin,
  deleteBlog,
  getEditBlog,
  editBlog,
  getAddBlog,
  addBlog,
};
