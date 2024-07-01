import express from "express";
import user from "./user";
import coversation from "./conversation";
import message from "./message";
const router = express.Router();

router.use("/user", user);

router.use("/private-conversation", coversation);

router.use("/private-message", message);

export default router;
