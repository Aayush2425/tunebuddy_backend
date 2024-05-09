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
  const room = await Room.find();
};
