import dotenv from "dotenv";
import { Router } from "express";
import User from "../models/user.js";
import { Keypair } from "@solana/web3.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const router = Router();

router.post("/signup", async (req, res) => {
    const { username, password} = req.body;
    
    const newKeyPair = Keypair.generate();

    const user = await User.findOne({
        username
    });

    if(user){
        return res.json({status: 409, message: "User already exists"});
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    await User.create({
        username,
        password: hashedPassword,
        publicKey: newKeyPair.publicKey.toString(),
        privateKey: newKeyPair.secretKey.toString()
    });

    return res.json({publicKey: newKeyPair.publicKey.toString()});
});

router.post("/signin", async (req, res) => {
    const { username, password} = req.body;
    const user = await User.findOne({username});
    
    if(!user){
        return res.json({status: 404, message: "User not exists"})
    }

    const checkPassword = bcryptjs.compare(password, user.password);

    if(!checkPassword){
        return res.json({status: 401, message: "Invalid credentials"})
    }
    
    const token = jwt.sign({
        userId: user.id
    }, JWT_SECRET);

    return res.status(200).json({status: 200, token});
});

export const userRouter = router;