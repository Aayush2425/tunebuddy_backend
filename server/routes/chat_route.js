import express from "express";
const router = express.Router();
import { createRoom, getRoom } from "../controller/chat_controller.js";
router.post("/chat", createRoom);
router.get("/chatDetail", getRoom);
export default router;
