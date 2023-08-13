import { UserModel } from "../model/UserModel";
import { Request, Response } from "express";
const bcrypt = require('bcryptjs'); 

exports.update = async (req: Request, res: Response) => {
  const { email } = req.params;
  const { newPassword, oldPassword } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }

    const match=await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      return res.status(404).send("Old password is incorrect");
    }
    user.password = newPassword;
    await user.save();
    res.send("Password updated successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
};
