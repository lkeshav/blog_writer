<<<<<<< HEAD
import jwt, { SignOptions } from "jsonwebtoken";

export function signJwt(payload: object, expiresIn: string | number = "7d") {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const options: SignOptions = { expiresIn };

  return jwt.sign(payload, secret, options);
=======
import jwt, { Secret } from "jsonwebtoken";

export function signJwt(payload: object, expiresIn: string | number = "7d") {
  const secret = process.env.JWT_SECRET as Secret;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign(payload, secret, { expiresIn });
>>>>>>> 5490d41 (commit)
}
