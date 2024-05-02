import express from "express";
const router = express.Router();
import { SignUp, LogIn } from "../controller/auth_controller.js";
router.post("/SignUp", SignUp);
router.post("/SignIn", LogIn);
export default router;
