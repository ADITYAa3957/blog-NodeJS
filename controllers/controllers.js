const { max, auth, getToken, verifyToken } = require("../utils.js");
const blogModel = require("../models/blog");
const getHome = async (req, res) => {
  try{
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
  }
  catch(err)
  {
    res.error(500).send("Error!");
  }
}
const getBlog = async (req, res) => {
  try{
  const id = req.params.id; //got the id then
  //display this blog
  let blog = await blogModel.findOne({ _id: id });
  res.render("blog", { blog });
  }
  catch(err)
  {
    res.error(500).send("Error!");
  }
};
const getSearchResults = (req, res) => {
  try{
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
  }
  catch(err)
  {
    res.error(500).send("Error!");
  }
};
const getContact = (req, res) => {
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
};
const getAbout = (req, res) => {
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
};

module.exports = { getHome, getBlog, getSearchResults, getContact, getAbout };
