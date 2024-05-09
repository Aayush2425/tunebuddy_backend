import { Account, Room } from "../model/schemas.js";
export const getUser = async (req, res) => {
  const { id } = req.body;
  console.log(id);
  const user = await Account.findById(id);
  console.log(user);
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
