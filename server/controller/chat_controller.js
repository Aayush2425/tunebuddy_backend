import { Message, Room } from "../model/schemas.js";
export const createRoom = async (req, res) => {
  const { name, users } = req.body;
  const room = new Room({
    name: name,
    users: users,
  });
  await room.save();
  res.status(200).json(room);
};

export const getRoom = async (req, res) => {
  const { id } = req.query; // Assuming user ID is passed as a query parameter
  console.log(id);
  try {
    const rooms = await Room.find({ users: id });
    let chats = [];
    rooms.forEach((room) => {
      room.users.forEach((user) => {
        if (user !== id) {
          chats.push(user); // Push user ID to chats array if not the current user and not already in the list
        }
      });
    });
    res.status(200).json(chats);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
