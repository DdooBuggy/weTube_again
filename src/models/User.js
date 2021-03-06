import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, min: 2, max: 20 },
  email: { type: String, required: true, unique: true, min: 2, max: 50 },
  password: { type: String },
  name: { type: String, required: true, min: 2, max: 10 },
  socialOnly: { type: Boolean, default: false },
  avatarUrl: String,
  location: { type: String, max: 50 },
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 5);
  }
});

const User = mongoose.model("User", userSchema);
export default User;
