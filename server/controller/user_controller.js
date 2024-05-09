import { Account, Room } from "../model/schemas.js";
export const getUser = async (req, res) => {
  const { id } = req.body;

  const user = await Account.findById(id);
  const room = await Room.find({ users: id });
  let chats = [];
  room.forEach((rooms) => {
    rooms.users.filter((user) => {
      // console.log(user);
      user != id ? (chats = chats.concat(user)) : null;
    });
  });
  console.log(chats);
  res.status(200).json({ user: user, chats: chats });
};

export const getSearchUser = async (req, res) => {
  const user = await Account.find(
    {},
    {
      password: 0,
    }
  );
  console.log(user);
  res.status(200).json(user);
};
