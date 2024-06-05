import { Account, Room } from "../model/schemas.js";
export const getUser = async (req, res) => {
  const { id } = req.query; // Assuming user ID is passed as a query parameter
  console.log(id);
  try {
    const user = await Account.findById(id); // Adjust based on your schema and how you fetch the user
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
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
