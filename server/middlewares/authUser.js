import jwt from "jsonwebtoken";

// const authUser = async (req, res, next) => {
//   const { token } = req.cookies;

//   if (!token) {
//     return res.json({ success: false, message: "Not Authorised" });
//   }

//   try {
//     const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
//     if (tokenDecode.id) {
//       req.body.userId = tokenDecode.id;
//     } else {
//       return res.json({ success: false, message: "Not Authorised" });
//     }

//     next();
//   } catch (error) {
//     return res.json({ success: false, message: error.message });
//   }
// };

const authUser = async (req, res, next) => {
  // support both cookie and Authorization: Bearer <token>
  const token =
    req.cookies?.token || req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorised" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET); // { id, iat, exp }
    if (!payload?.id) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorised" });
    }
    req.auth = { userId: payload.id, exp: payload.exp };
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

export default authUser;
