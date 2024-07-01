import jwt from "jsonwebtoken";

const secretAccessToken = process.env.KEY as string;
const expiresIn = process.env.JWT_EXPIRES_IN || "1d";
const secretRefreshToken = process.env.KEY as string;
interface Payload {
  [key: string]: any;
}

export const generateAccessToken = (payload: Payload): string => {
  return jwt.sign(payload, secretAccessToken, { expiresIn });
};

export const generateRefreshToken = (payload: Payload): string => {
  return jwt.sign(payload, secretRefreshToken, { expiresIn: "7d" });
};

export const verifyToken = (token: string): Promise<Payload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretAccessToken, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded as Payload);
    });
  });
};
