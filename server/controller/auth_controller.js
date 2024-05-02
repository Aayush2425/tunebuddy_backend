import bcrypt from "bcryptjs";
import { Account } from "../model/schemas.js";
import jwt from "jsonwebtoken";
export const LogIn = async (req, res) => {
  try {
    const user = await Account.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "incorrect password",
      });
    }
    const token = jwt.sign(
      {
        id: user._id,
      },
      "secret",
      {
        expiresIn: "1h",
      }
    );
    res.cookie("token", token, {
      httpOnly: true,
    });
    res.status(200).json({
      message: "logged in",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const SignUp = async (req, res) => {
  const { username, email, password } = req.body;
  console.log(username, email, password);
  const hashPassword = bcrypt.hashSync(password, 10);
  const user = new Account({ username, email, password: hashPassword });

  try {
    await user.save();
    res.status(201).json({
      message: "user created",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
