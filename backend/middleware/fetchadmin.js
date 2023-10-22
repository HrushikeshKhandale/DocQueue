var jwt = require("jsonwebtoken");
const JWT_SECRET = "HKisagoodb$oy";

const fetchadmin = (req, res, next) => {
  // Get the admin from the JWT token and add it to req object
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "Please authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.admin = data.admin;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate using a valid token" });
  }
};

module.exports = fetchadmin;
