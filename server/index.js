import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import authRouter from "./routes/auth_route.js";
import userRouter from "./routes/user_route.js";
import chatRouter from "./routes/chat_route.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Adjust as needed
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use(authRouter);
app.use(userRouter);
app.use(chatRouter);

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

// User socket management
const users = {};

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("register", (userId) => {
    users[userId] = socket.id;
    console.log("User registered:", userId, socket.id);
    console.log("Current users:", users);
  });

  socket.on("private_message", ({ recipientId, message, senderId }) => {
    console.log(
      `Private message from ${senderId} to ${recipientId}: ${message}`
    );
    const recipientSocketId = users[recipientId];
    console.log("Recipient socket ID:", recipientSocketId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("private_message", { message, senderId });
      console.log(`Message sent from ${senderId} to ${recipientId}`);
    } else {
      console.log("Recipient not connected:", recipientId);
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
    console.log("Current users after disconnect:", users);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
