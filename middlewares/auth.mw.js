const jwtService = require("../services/jwt.service");
const { log } = require("../services/response.service");
const msg = require("../utils/messages.utils");

/**
 * Middleware to authenticate the user based on the provided JWT token in the Authorization header.
 * @param {Request} req - The Express request object, extended with a user property.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 */
async function webAuth(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    res.status(403).json(log(false, msg.auth.AUTH_HEADER));
    return;
  }

  try {
    const token = jwtService.extractBearerToken(authHeader) || '';
    const verifyJwtData = await jwtService.verifyJwt(token);

    if (!verifyJwtData.status) {
      res.status(403).json(log(false, msg.auth.NOT_VERIFIED));
      return;
    }

    req.user = verifyJwtData.jwtData;
    next(); 
  } catch (err) {
    res.status(403).json(log(false, msg.auth.INTERNAL_ERROR));
  }
}

module.exports = webAuth;
