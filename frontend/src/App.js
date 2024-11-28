import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Contract_Address as CONTRACT_ADDRESS, Betting as CONTRACT_ABI } from "./abi/Betting";

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  const [betList, setBetList] = useState([]);

  const [betAmount, setBetAmount] = useState("");
  const [chosenTeam, setChosenTeam] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [winner, setWinner] = useState(null);

  const [status, setStatus] = useState("");
  const [winnings, setWinnings] = useState(0);

  useEffect(() => {
    const initializeEthers = async () => {
      if (window.ethereum) {
        try {
          // Initialize provider and signer
          const provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(provider);
  
          const signer = await provider.getSigner();
          setSigner(signer);
  
          // Initialize contract
          const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
          setContract(contract);
  
          // Fetch the owner using `.get()` in Ethers.js v6
          const owner = await contract.owner();
          const userAddress = await signer.getAddress();
  
          // Check if the connected user is the owner
          setIsOwner(userAddress.toLowerCase() === owner.toLowerCase());
          console.log("Contract owner:", owner);
          console.log("Connected user is owner:", isOwner);
        } catch (error) {
          console.error("Error initializing contract:", error);
          setStatus("Failed to connect to the contract.");
        }
      } else {
        console.error("Ethereum provider not found!");
        setStatus("Please install a wallet like MetaMask.");
      }
    };
    initializeEthers();
  }, []);

  const lockContract = async () => {
    try {
      const tx = await contract.toggleIsContractLocked();
      await tx.wait();
      setStatus("Contract locked successfully!");
    } catch (error) {
      console.error(error);
      setStatus("Error locking contract. Check the console for details.");
    }
  }

  const extractBets = (proxyResult) => {
    const betList = [];
    for (let i = 0; i < proxyResult.length; i++) {
      const bet = proxyResult[i];
      betList.push({
        bettor: bet[0],
        amount: ethers.formatEther(bet[1].toString()), // Convert Wei to ETH
        chosenTeam: bet[2].toString(), // Convert BigInt to string for safety
      });
    }
    return betList;
  };

  useEffect(() => {
    const getBets = async () => {
      try {
        const bets = await contract.getBets();
        setBetList(extractBets(bets));
      } catch (error) {
        console.error(error);
        setStatus("Error fetching bets. Check the console for details.");
      }
    }
    if (contract){
      getBets();
    }
  }, [contract])
  const placeBet = async () => {
    if (!betAmount || chosenTeam === null) {
      setStatus("Please enter a bet amount and select a team.");
      return;
    }
    console.log(chosenTeam,ethers.parseEther(betAmount))
    try {
      const tx = await contract.placeBet(chosenTeam, { value: ethers.parseEther(betAmount) });
      await tx.wait();
      setStatus("Bet placed successfully!");
    } catch (error) {
      console.error(error);
      setStatus("Error placing bet. Check the console for details.");
    }
  };

  const submitResult = async () => {
    if (winner === null) {
      setStatus("Please select the winning team.");
      return;
    }

    try {
      const tx = await contract.submitResult(winner);
      await tx.wait();
      setStatus("Result submitted successfully!");
    } catch (error) {
      console.error(error);
      setStatus("Error submitting result. Check the console for details.");
    }
  };

  const distributeWinnings = async () => {
    try {
      const tx = await contract.distributeWinnings();
      await tx.wait();
      setStatus("Winnings distributed successfully!");
    } catch (error) {
      console.error(error);
      setStatus("Error distributing winnings. Check the console for details.");
    }
  };

  const withdrawWinnings = async () => {
    try {
      const tx = await contract.withdrawWinnings();
      await tx.wait();
      setStatus("Winnings withdrawn successfully!");
    } catch (error) {
      console.error(error);
      setStatus("Error withdrawing winnings. Check the console for details.");
    }
  };

  const checkWinnings = async () => {
    try {
      const userAddress = await signer.getAddress();
      const userWinnings = await contract.winnings(userAddress);
      setWinnings(ethers.formatEther(userWinnings));
    } catch (error) {
      console.error(error);
      setStatus("Error fetching winnings. Check the console for details.");
    }
  };

  
  console.log(betList)
  return (
    <div style={{ padding: "20px" }}>
      <h1>SMUS Betting DApp</h1>
      <p>Status: {status}</p>
      <div>
        <h2>Bets</h2>
        <table>
          <thead>
            <tr>
              <th>Bettor</th>
              <th>Amount</th>
              <th>Team</th>
            </tr>
          </thead>
          <tbody>
            {betList.map((bet, index) => (
              <tr key={index}>
                <td>{bet.bettor}</td>
                <td>{bet.amount} ETH</td>
                <td>{bet.chosenTeam === "0" ? "Team A" : "Team B"}</td>
              </tr>
            ))}
          </tbody>
        </table>
       
      </div>
      <h2>Place a Bet</h2>
      <input
        type="number"
        placeholder="Bet Amount (ETH)"
        value={betAmount}
        onChange={(e) => setBetAmount(e.target.value)}
      />
      <div>
        <label>
          <input
            type="radio"
            name="team"
            value="0"
            onChange={() => setChosenTeam(0)}
          />
          Team A
        </label>
        <label>
          <input
            type="radio"
            name="team"
            value="1"
            onChange={() => setChosenTeam(1)}
          />
          Team B
        </label>
      </div>
      <button onClick={placeBet}>Place Bet</button>

      {isOwner && (
        <>
          <h2>Submit Game Result</h2>
          <div>
            <label>
              <input
                type="radio"
                name="winner"
                value="0"
                onChange={() => setWinner(0)}
              />
              Team A
            </label>
            <label>
              <input
                type="radio"
                name="winner"
                value="1"
                onChange={() => setWinner(1)}
              />
              Team B
            </label>
          </div>
          <button onClick={submitResult}>Submit Result</button>

          <h2>Distribute Winnings</h2>
          <button onClick={distributeWinnings}>Distribute Winnings</button>
        </>
      )}

      <h2>Withdraw Winnings</h2>
      <button onClick={withdrawWinnings}>Withdraw</button>
      <button onClick={checkWinnings}>Check Winnings</button>
      {winnings > 0 && <p>Your Winnings: {winnings} ETH</p>}

      <button onClick={() => lockContract()}>Lock Contract</button>
    </div>
  );
}

export default App;