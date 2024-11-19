import logo from './logo.svg';
import './App.css';
import {useState} from 'react';
import {ethers} from 'ethers';
import { moneySender } from './abi/moneySender';

function App() {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState(0);
  const sendMoney = async (e) => {
    e.preventDefault();
    console.log("Sending money...");
    if (!window.ethereum) {
      alert("MetaMask is required to use this application.");
      return;
    }
    console.log("MetaMask is installed!");
    try {
      // Connect to MetaMask
      
      if (window.ethereum?.isMetaMask) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        console.log("Connected to MetaMask:", signer);
        // Contract address and ABI
        const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
        const contractABI = moneySender;

        // Connect to the contract
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        // Send ETH
        const tx = await contract.sendMoney(address, {
          value: ethers.parseEther(amount), // Convert amount to WEI
        });

        // Wait for the transaction to be mined
        await tx.wait();
        alert(`Successfully sent ${amount} ETH to ${address}`);
      } else {
        alert("Please ensure MetaMask is installed and active.");
      }
      
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please check the console for details.");
    }
  };
  return (
    <div className="app"> 
      <div className="header">MoneySender</div>
      <form>
        <input placeholder="address" value={address} onChange={(e) => setAddress(e.target.value)}></input>
        <input placeholder="amount" value={amount} onChange={(e) => setAmount(e.target.value)}></input>
        <button onClick={(e) => sendMoney(e)}>Send Money</button>
      </form>
    </div>
  );
}

export default App;
