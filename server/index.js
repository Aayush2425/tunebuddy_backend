import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Message from "./model/schemas.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Update as needed
    methods: ["GET", "POST"],
  },
});

const users = {};

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("register", async ({ userId }) => {
    users[userId] = socket.id;
    console.log("User registered:", userId, socket.id);

    // Check for undelivered messages
    const undeliveredMessages = await Message.find({
      recipientId: userId,
      delivered: false,
    });

    // Send undelivered messages to the user
    undeliveredMessages.forEach((msg) => {
      io.to(socket.id).emit("private_message", {
        message: msg.message,
        senderId: msg.senderId,
      });
      // Mark the message as delivered
      msg.delivered = true;
      msg.save();
    });

    console.log("Current users:", JSON.stringify(users, null, 2));
  });

  socket.on("private_message", async ({ recipientId, message, senderId }) => {
    console.log(
      `Private message from ${senderId} to ${recipientId}: ${message}`
    );
    console.log(
      "Current users before sending message:",
      JSON.stringify(users, null, 2)
    );

    const recipientSocketId = users[recipientId];
    console.log("Recipient socket ID:", recipientSocketId);

    if (recipientSocketId) {
      // Recipient is online, send the message
      io.to(recipientSocketId).emit("private_message", { message, senderId });
      console.log(`Message sent from ${senderId} to ${recipientId}`);
    } else {
      console.log("Recipient not connected:", recipientId);
      // Recipient is offline, store the message for later delivery
      const newMessage = new Message({
        senderId,
        recipientId,
        message,
      });
      await newMessage.save();
      console.log(
        `Message from ${senderId} to ${recipientId} stored for later delivery`
      );
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    for (let userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        console.log("User disconnected and removed:", userId);
        break;
      }
    }
    console.log(
      "Current users after disconnect:",
      JSON.stringify(users, null, 2)
    );
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
