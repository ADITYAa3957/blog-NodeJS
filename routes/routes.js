const express = require("express");
const router = express.Router();
const {getHome,getBlog,getSearchResults,getContact, getAbout,getError404} = require("../controllers/controllers.js");
router.get("/",getHome);
router.get("/blog/:id", getBlog);

router.post("/search", getSearchResults);
router.get("/contact", getContact);
router.get("/about", getAbout);
module.exports = router;