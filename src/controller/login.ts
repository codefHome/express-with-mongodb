import { UserModel } from "../model/UserModel";
import { Request, Response } from "express";
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

exports.login = async (req: Request, res: Response) => {
  const { email, password, oneTimeCode } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(200).send({message:"Invalid credentials"});
    }
    
    const match=await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(200).send({message:"Invalid credentials"});
    }
    if (user.twoFactorAuth && !user.verifyOneTimeCode(oneTimeCode)) {
      return res.status(200).send({ message:"Invalid one-time code"});
    }

    const token = jwt.sign({ id: user._id }, "mysecret");
    res.cookie("tokens", token, { httpOnly: true });
    res.send({ message: "Login successfull", token: token });
  } catch (err: any) {
    console.error(err?.message);
    res.status(200).send("Server error");
  }
};
