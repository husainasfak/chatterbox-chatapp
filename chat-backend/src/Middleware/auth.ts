import { NextFunction, Request, Response } from "express";
import { getToken, setToken } from "../utils/TokenUtils";
import { verifyToken } from "../utils/jwt";
import jwt from "jsonwebtoken";
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { accessToken, refreshToken } = getToken(req);

  if (!accessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decodedData = await verifyToken(accessToken);
    if (decodedData) {
      req.user = decodedData;
    }
    next();
  } catch (err) {
    console.log("[Access Token Error]", err);
    if (err instanceof jwt.TokenExpiredError) {
      if (!refreshToken) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      try {
        console.log("Using rerfres token");
        const decodedRefresh = await verifyToken(refreshToken);
        const payload = {
          userName: decodedRefresh.userName,
          id: decodedRefresh.id,
          imageUrl: decodedRefresh.imageUrl,
        };
        const token = setToken(res, payload);
        if (token) {
          req.user = decodedRefresh;
          next();
        }
      } catch (refreshErr) {
        console.log("[Refresh Token Error]", err);
        return res.status(401).json({ error: "Unauthorized" });
      }
    } else if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: "Unauthorized" });
    } else {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};
