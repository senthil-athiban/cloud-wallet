import React, { useState } from "react";
import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import axios from "axios";

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

const Form = () => {

  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState(0);

  const handleSubmit = async () => {
    
    const payerPublicKey = new PublicKey("GbfcvLYNpPDtw9PAjSQvL5wgF5kwRh9tES8QwiP1226D");
    const transaction = new Transaction().add(SystemProgram.transfer({
      fromPubkey: payerPublicKey,
      toPubkey: new PublicKey(address),
      lamports: amount * LAMPORTS_PER_SOL,
    }));

    const {blockhash} = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = payerPublicKey;

    const serializedTx = transaction.serialize({
      requireAllSignatures: false,
      verifySignatures: false
    });

    console.log(serializedTx);

    const res = await axios.post("http://localhost:3000/api/v1/tx/sign", {
      message: serializedTx,
      retry: false
    }, {
      headers: {
        Authorization: `${token}`
      }
    });

  };
  return (
    <div>
      <input type="text" placeholder="public key" onChange={(e) => setAddress(e.target.value)}/>
      <input type="text" placeholder="amount" onChange={(e) => setAmount(parseInt(e.target.value, 10))} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default Form;
