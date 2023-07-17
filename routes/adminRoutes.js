const express = require("express");
const router = express.Router();
const { max, auth, getToken, verifyToken } = require("../utils.js");

const {
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
} = require("../controllers/adminControllers");

router.get("/admin-login", getLoginAdmin);

router.post("/admin-login", loginAdmin);
router.get("/logout", auth, adminLogout);
router.get("/dashboard", auth, getDashboard);
router.get("/add-admin", auth, getAddAdmin);
router.post("/add-admin", auth, addAdmin);
router.delete("/delete/:id", auth, deleteBlog);
router.get("/edit/:id", auth, getEditBlog);
router.patch("/edit/:id", auth, editBlog);
router.get("/add-blog", auth, getAddBlog);

router.post("/add-blog", auth, addBlog);

module.exports = router;
