import express from "express";
import { getSearchUser, getUser } from "../controller/user_controller.js";
const router = express.Router();
router.post("/user", getUser);
router.get("/searchUser", getSearchUser);
export default router;
