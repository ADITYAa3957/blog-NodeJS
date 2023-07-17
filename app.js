const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const normalRoutes = require("./routes/routes");
const adminRoutes = require("./routes/adminRoutes");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI).then(() => {
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

app.use(normalRoutes);
app.use(adminRoutes);
