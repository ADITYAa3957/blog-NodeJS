const jwt = require("jsonwebtoken");
const jwt_secretKey =process.env.JWT_SECRET;

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
const getToken = (id) => {
  return jwt.sign({ id }, jwt_secretKey);
};
const verifyToken = (token) => {
  return jwt.verify(token, jwt_secretKey);
};
module.exports = {max,auth,getToken,verifyToken};
