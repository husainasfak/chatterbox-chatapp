import { Request, Response } from "express";
import { generateAccessToken, generateRefreshToken } from "./jwt";

type User = {
  id: string;
  userName: string;
  imageUrl: string;
};

export const setToken = (res: Response, payload: User) => {
  const accessToken = generateAccessToken(payload);
  res.cookie("accessToken", accessToken);

  const refreshToken = generateRefreshToken(payload);
  res.cookie("refreshToken", refreshToken);

  return accessToken;
};
export const getToken = (req: Request) => {
  const accessToken = req.cookies["accessToken"];
  const refreshToken = req.cookies["refreshToken"];
  return { accessToken, refreshToken };
};
