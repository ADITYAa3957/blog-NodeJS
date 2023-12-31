const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const normalRoutes = require("./routes/routes");
require("dotenv").config({path:'./.env'});
const adminRoutes = require("./routes/adminRoutes");
mongoose.connect(process.env.MONGODB_URI).then(() => {
  // console.log("connected");
  let PORT = process.env.PORT_NO || 3000;
  app.listen(PORT); //will start listening
}).catch((err)=>
{
  console.log(err.message);
});

app.set("view engine", "ejs"); //setting the view engine
app.set("views", "views"); //setting the views folder
app.use(express.static("public")); //setting the folder for the static files
app.use(express.urlencoded({extended:false})); //for form
app.use(cookieParser()); //for ease in setting the cookies
app.use(methodOverride("_method")); //for using delete and others in form
app.use(normalRoutes);
app.use(adminRoutes);
app.use((req,res)=> //error404 page
{
  res.render("error404");
});

