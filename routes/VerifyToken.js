import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  // console.log(req.headers.authorization, "====>>> req.header.authorization")
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, "ahsan", (err, decoded) => {
      if (err) {
        return res.status(403).json("Token is not valid!");
      }
      // console.log(req , "req");
      // console.log(decoded , "decod");
      req.user = decoded; // Set req.user with the decoded token payload ; 
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};

export const verifyTokenAndAuthorization = (req, res, next) => {
  // console.log(req.user);
  verifyToken(req, res, () => {
    if (req.user && (req.user.id === req.params.id || req.user.isAdmin)) {
      next();
    } else {
      res.status(403).json("You are not allowed to do that!");
    }
  });
};

export const verifyTokenAndAdmin = (req, res, next) => {
  // console.log(req, "====>>>>req")
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not alowed to do that!");
    }
  });
};
