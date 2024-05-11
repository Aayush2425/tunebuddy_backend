import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import authRouter from "./routes/auth_route.js";
import userRouter from "./routes/user_route.js";
import chatRouter from "./routes/chat_route.js";
import cors from "cors";
import dotenv from "dotenv";
const app = express();
dotenv.config();
const httpServer = createServer(app);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
export const io = new Server(httpServer, {
  /* options */
});
app.listen(4000, () => console.log("App is running on server 4000"));
mongoose
  .connect(
    "mongodb+srv://AayushGandhi:YPajUaTDpleeamPx@userinfo.b92p5dr.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("connected to MongoDb"))
  .catch((err) => console.log(err));
io.on("connection", (socket) => {
  console.log("Client connected ... ", socket.id);
  socket.on("typing", (data) => {
    console.log(data);
    io.emit("typing", data);
  });
  socket.on("message", function name(data) {
    console.log(data);
    data["targetId"].emit("message", data);
  });

  socket.on("connect", function () {});

  socket.on("disconnect", function () {
    console.log("client disconnect...", client.id);
    // handleDisconnect()
  });

  socket.on("error", function (err) {
    console.log("received error from client:", client.id);
    console.log(err);
  });
});
httpServer.listen(3000, () => console.log("server running on port 3000"));

app.use(authRouter);
app.use(userRouter);
app.use(chatRouter);
