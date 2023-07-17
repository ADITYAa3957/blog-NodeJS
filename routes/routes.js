const express = require("express");
const router = express.Router();
const {max,auth,getToken,verifyToken} = require("../utils.js");
const blogModel = require("../models/blog");


router.get("/", async (req, res) => {
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
router.get("/blog/:id", async (req, res) => {
  const id = req.params.id; //got the id then
  //display this blog
  let blog = await blogModel.findOne({ _id: id });
  res.render("blog", { blog });
});

router.post("/search", (req, res) => {
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
router.get("/contact", (req, res) => {
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
  res.render("contact", { admin });
});
router.get("/about", (req, res) => {
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
  res.render("about", { admin });
});

module.exports = router;