import JWT from "jsonwebtoken";
import createError from "http-errors";

export const generateAccessToken = (user_id) => {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
      issuer: "ZAG.com",
      audience: user_id,
      expiresIn: 60 * 60 * 2,
    };

    JWT.sign(payload, secret, options, (error, token) => {
      if (error) reject(error);
      else resolve(token);
    });
  });
};

export const verifyAccessToken = (req, res, next) => {
  if (!req.headers["authorization"])
    return next(createError.Unauthorized("Auth header missing"));

  const bearerToken = req.headers["authorization"].split(" ");
  const token = bearerToken[1];

  JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, payload) => {
    if (error) {
      if (error.name) {
        console.log({ error });
        return next(createError.Unauthorized(error.message));
      } else {
        return next(createError.Unauthorized("Unauthorized"));
      }
    } else req.payload = payload;
    return next();
  });
};
