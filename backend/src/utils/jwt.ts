import jwt, { Secret } from "jsonwebtoken";

export function signJwt(payload: object, expiresIn: string | number = "7d") {
  const secret = process.env.JWT_SECRET as Secret;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign(payload, secret, { expiresIn });
}
