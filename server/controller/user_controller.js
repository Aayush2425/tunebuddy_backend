import { Account, Room } from "../model/schemas.js";
export const getUser = async (req, res) => {
  const { id } = req.body;

  const user = await Account.findById(id);
  const room = await Room.find({ users: id });
  let chats = [];
  room.forEach((rooms) => {
    console.log(
      rooms.users.filter((user) => {
        // console.log(user);
        user != id ? id : null;
      })
    );
    chats = chats.concat(rooms.users);
  });
  console.log(chats);
  res.status(200).json(user);
};

export const getSearchUser = async (req, res) => {
  const user = await Account.find(
    {},
    {
      email: 1,
    }
  );
  console.log(user);
  res.status(200).json(user);
};
