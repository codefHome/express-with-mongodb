import { UserModel } from "../model/UserModel";
import { Request, Response } from "express";

exports.getUserByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const user = await UserModel.findOne({ email });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
