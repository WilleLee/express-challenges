import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
  username: { type: String, required: true },
  useremail: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 3);
  }
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
