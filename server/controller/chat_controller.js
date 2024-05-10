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
  const { id } = req.body;
  const room = await Room.find({ users: id });
  let chats = [];
  room.forEach((rooms) => {
    rooms.users.filter((user) => {
      // console.log(user);
      user != id ? (chats = chats.concat(user)) : null;
    });
  });
  res.status(200).json(chats);
};
