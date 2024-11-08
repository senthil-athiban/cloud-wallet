import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    publicKey: {
        type: String
    },
    privateKey: {
        type: String
    }
});

const User = mongoose.model("User", UserSchema);

export default User;