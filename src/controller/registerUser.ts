import { UserModel } from "../model/UserModel";
import { Request, Response } from "express";

exports.register = async (req: Request, res: Response) => {
  try {
    const users = new UserModel({ ...req.body });
    await users.save();
    res.json(users);
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Email already exists" });
    } else {
      res.status(500).json({ message: error });
    }
  }
};
