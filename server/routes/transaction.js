import { Connection, Keypair, Transaction } from "@solana/web3.js";
import { Router } from "express";
import User from "../models/user.js";
import { authMiddleware } from "../middleware/middleware.js";

const router = Router();
const connection = new Connection("https://api.devnet.solana.com", "confirmed");

router.post("/sign", authMiddleware, async (req, res) => {
    const { message, retry } = req.body;

    const deserializedTx = Transaction.from(Buffer.from(message, "base64"));
    const userId = req.userId;
    
    const user = await User.findById({ _id: userId });
    const privateKeyArray = Uint8Array.from(user.privateKey.split(',').map(Number));

    const keyPair = Keypair.fromSecretKey(privateKeyArray);

    try {
        const { blockhash } = await connection.getLatestBlockhash();
        deserializedTx.recentBlockhash = blockhash;
        deserializedTx.feePayer = keyPair.publicKey;

        deserializedTx.sign(keyPair);

        const signature = await connection.sendTransaction(deserializedTx, [keyPair]);

        return res.json({
            status: 200,
            message: signature
        });
    } catch (error) {
        console.log("Error in signing the transaction", error);
        return res.status(500).json({status:500, message: "Internal Server Error"});
    }
});

router.get("/", authMiddleware, async (req, res) => {
    const { transaction } = req.query;

    if(!transaction) {
        return res.status(400).json({status: 400, message: "Missing transaction id"});
    }

    try {
        const tx = await connection.getTransaction(transaction, {commitment: "confirmed"});

        return res.status(200).json({transaction: tx});
    } catch (error) {
        console.log("Error in fetching transaction", error);
    }

})

export const txRouter = router;