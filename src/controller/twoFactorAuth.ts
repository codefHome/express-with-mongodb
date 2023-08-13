import { UserModel } from "../model/UserModel";
import { Request, Response } from "express";
const speakeasy = require("speakeasy");

exports.twoFactor = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).send("User not found");
    }

    await user.generateSecretKey();

    user.twoFactorAuth = true;
    await user.save();
    // Generate a one-time code
    const oneTimeCode = speakeasy.totp({
      secret: user.secretKey,
      encoding: "base32",
    });

    // Send the QR code URL and one-time code to the client
    const qrCodeURL = await user.getQRCodeURL();
    res.send({ qrCodeURL, oneTimeCode });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//update two Factor Option
exports.updateTwoFactor = async (req: Request, res: Response) => {
  const { email } = req.params;
  const { twoFactorAuth } = req.body;

  try {
    const user = await UserModel.findOneAndUpdate(
      { email },
      { twoFactorAuth },
      { new: true }
    );
    if (!user) {
      return res.status(404).send("User not found");
    }
    if (twoFactorAuth) {
      res.send("Two Factor Auth Enabled");
    }
    if (!twoFactorAuth) {
      res.send("Two Factor Auth Disabled");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
};
