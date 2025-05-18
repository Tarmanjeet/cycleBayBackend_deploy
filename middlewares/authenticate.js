const jwt = require("jsonwebtoken");
const tokenSecret = process.env.TOKEN_SECRET;

const isAuth = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided in x-access-token" });
  }

  try {
    const decoded = jwt.verify(token, tokenSecret);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

function ownsProduct(Product) {
  return async (req, res, next) => {
    try {
      console.log("Inside ownsProduct middleware, checking product ownership...");
      const product = await Product.findById(req.params.id);
      if (!product) {
        console.log("Product not found in ownsProduct middleware");
        return res.status(404).sendFile("404.html", { root: process.cwd() });
      }
      if (product.createdBy.toString() !== req.user.userId) {
        console.log("User does not own product");
        return res.status(403).json({ success: false, message: "You do not own this product" });
      }
      next();
    } catch (err) {
      console.error("Error inside ownsProduct middleware:", err);
      next(err);
    }
  };
}

const isSuperAdmin = (req, res, next) => {
  if (!req.user || req.user.type !== "superadmin") {
    return res.status(403).json({ success: false, message: "You are not a super admin" });
  }
  next();
};

module.exports = {
  isAuth,
  ownsProduct,
  isSuperAdmin
};
