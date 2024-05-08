import express from "express";
const router = express.Router();
import { createRoom } from "../controller/chat_controller.js";
router.post("/chat", createRoom);
export default router;
