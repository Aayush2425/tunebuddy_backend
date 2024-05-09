import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Define schema for a chat message
const messageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: "Account", required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  room: { type: Schema.Types.ObjectId, ref: "Room", required: true },
});

// Define schema for a chat room
const roomSchema = new Schema({
  name: { type: String, required: true },
  users: [{ type: Schema.Types.ObjectId, ref: "Account" }],
  messages: [{ type: Schema.Types.ObjectId, ref: "Message", default: [] }],
});

// Define schema for a user
const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, default: "" },
  password: { type: String, default: "" },
});

// Define schema for a song
const songSchema = new Schema({
  title: { type: String, required: true }, // Title of the song
  artist: { type: String, required: true }, // Artist of the song
  album: { type: String }, // Album of the song
  duration: { type: Number, required: true }, // Duration of the song in seconds
  url: { type: String, required: true }, // URL or identifier for the song (e.g., YouTube URL)
  thumbnail: { type: String }, // URL to the song's thumbnail image
  // Add other song-related properties as needed
});

// Define schema for a music queue item
const queueItemSchema = new Schema({
  song: { type: Schema.Types.ObjectId, ref: "Song", required: true }, // Reference to the song
  addedBy: { type: Schema.Types.ObjectId, ref: "Account", required: true }, // Reference to the user who added the song to the queue
  addedAt: { type: Date, default: Date.now }, // Timestamp when the song was added to the queue
  // Add other queue item-related properties as needed
});

// Define schema for a music queue
const queueSchema = new Schema({
  items: [queueItemSchema], // Array of queue items
  // Add other queue-related properties as needed
});

// Define schema for a music bot server
const serverSchema = new Schema({
  serverId: { type: String, required: true }, // Unique identifier for the server
  queue: { type: Schema.Types.ObjectId, ref: "Queue" }, // Reference to the music queue for the server
  // Add other server-related properties as needed
});

// Define schema for a music bot session
const sessionSchema = new Schema({
  server: { type: Schema.Types.ObjectId, ref: "Server", required: true }, // Reference to the server
  connectedUsers: [{ type: Schema.Types.ObjectId, ref: "Account" }], // Array of users connected to the session
  // Add other session-related properties as needed
});

// Define models based on the schemas
export const Message = mongoose.model("Message", messageSchema);
export const Room = mongoose.model("Room", roomSchema);
export const Account = mongoose.model("Account", userSchema);
export const Song = mongoose.model("Song", songSchema);
export const QueueItem = mongoose.model("QueueItem", queueItemSchema);
export const Queue = mongoose.model("Queue", queueSchema);
export const CommonServer = mongoose.model("Server", serverSchema);
export const Session = mongoose.model("Session", sessionSchema);

// Export models
// module.exports = {
//   Message,
//   Room,
//   Account,
//   Song,
//   QueueItem,
//   Queue,
//   CommonServer,
//   Session,
// };
