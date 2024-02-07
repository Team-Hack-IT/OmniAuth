import mongoose, { InferSchemaType } from "mongoose";
const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: { 
    type: String, 
    required: true },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

type User = InferSchemaType<typeof UserSchema>;
const User = mongoose.model("User", UserSchema);

export default User;