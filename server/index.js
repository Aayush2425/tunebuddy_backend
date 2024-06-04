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
const users = {};
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
  socket.on("register", (userId) => {
    users[userId] = socket.id;
    console.log("User registered:", userId, socket.id);
  });

  socket.on("private_message", ({ recipientId, message, senderId }) => {
    console.log(users[recipientId]);
    console.log(users[`"${recipientId}"`]);
    console.log(users);

    const recipientSocketId = users[`"${recipientId}"`];
    console.log(recipientSocketId);
    if (recipientSocketId) {
      // Send the message to the specific client
      io.to(recipientSocketId).emit("private_message", { message, senderId });
      console.log(`Message sent from ${senderId} to ${recipientId}`);
    } else {
      console.log("Recipient not connected:", recipientId);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    // Remove the user from the users object
    for (let userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        break;
      }
    }
  });
});
httpServer.listen(3000, () => console.log("server running on port 3000"));

app.use(authRouter);
app.use(userRouter);
app.use(chatRouter);
