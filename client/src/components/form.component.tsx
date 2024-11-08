import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import React, { useState } from "react";

const Form = () => {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState(0);
  const handleSubmit = async () => {

    const transaction = new Transaction().add(SystemProgram.transfer({
      fromPubkey: window.localStorage.getItem().tempPublickey,
      toPubkey: new PublicKey(address),
      lamports: amount * LAMPORTS_PER_SOL,
    }))
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
