import jwt from "jsonwebtoken";

const authSeller = async (req, res, next) => {
  const { sellerToken } = req.cookies;

  if (!sellerToken) {
    return res.json({ success: false, message: "Seller Not Authorised" });
  }

  try {
    const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET); // { id, iat, exp }
    if (tokenDecode.email === process.env.SELLER_EMAIL) {
      next();
    } else {
      return res.json({ success: false, message: "Seller not authorised" });
    }
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

export default authSeller;
