import mongoose, { Document, Schema } from "mongoose";
const jwt = require("jsonwebtoken");
const qrcode = require("qrcode");
const speakeasy = require("speakeasy");
const bcrypt = require('bcryptjs'); 


interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  twoFactorAuth: boolean;
  secretKey?: string;
  oneTimeCode: string;
  generateSecretKey: () => Promise<void>;
  getQRCodeURL: () => Promise<void>;
  verifyOneTimeCode: (val: string) => Promise<boolean>;
}

//MongoDb schema for  user collection
const UserSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  twoFactorAuth: {
    type: Boolean,
    default: false,
  },
  secretKey: String,
  oneTimeCode: String,
});

UserSchema.pre('save', async function(next) {
 
  if (this.isModified('password') || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
  }
  // call next to proceed to the next middleware or save operation
  next();
});

// method to generateSecretKey for two factor Authentication
UserSchema.methods.generateSecretKey = async function () {
  const secretKey = jwt.sign({ id: this._id }, "mysecret");
  this.secretKey = secretKey;
  await this.save();
};

//method to generate one time qrcode
UserSchema.methods.getQRCodeURL = async function () {
  return qrcode.toDataURL(this.secretKey);
};

// method to verify one time
UserSchema.methods.verifyOneTimeCode = function (oneTimeCode: string): boolean {
  return speakeasy.totp.verify({
    secret: this.secretKey,
    encoding: "base32",
    token: oneTimeCode,
    window: 3,
  });
};
export const UserModel = mongoose.model<IUser>("User", UserSchema);
