import jwt from 'jsonwebtoken';

export function signJwt(payload: object, expiresIn: string | number = '7d') {
  const secret = process.env.JWT_SECRET as string;
  return jwt.sign(payload, secret, { expiresIn });
}


