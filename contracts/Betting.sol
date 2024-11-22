// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Betting {
    struct Bet {
        address bettor;
        uint256 amount;
        uint8 chosenTeam; // 0 for Team A, 1 for Team B
    }

    Bet[] public bets;
    mapping(address => uint256) public winnings;
    address public owner;
    uint256 public totalBetsTeamA;
    uint256 public totalBetsTeamB;
    uint8 public winningTeam;
    bool public resultSubmitted;

    event BetPlaced(address indexed bettor, uint256 amount, uint8 team);
    event ResultSubmitted(uint8 winningTeam);
    event WinningsDistributed(uint256 totalWinnings);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
        resultSubmitted = false;
    }

    function placeBet(uint8 team) external payable {
        require(msg.value > 0, "Bet amount must be greater than zero");
        require(team == 0 || team == 1, "Invalid team selection");
        require(!resultSubmitted, "Betting is closed, result already submitted");

        bets.push(Bet({
            bettor: msg.sender,
            amount: msg.value,
            chosenTeam: team
        }));

        if (team == 0) {
            totalBetsTeamA += msg.value;
        } else {
            totalBetsTeamB += msg.value;
        }

        emit BetPlaced(msg.sender, msg.value, team);
    }

    function submitResult(uint8 _winningTeam) external onlyOwner {
        require(!resultSubmitted, "Result already submitted");
        require(_winningTeam == 0 || _winningTeam == 1, "Invalid winning team");

        winningTeam = _winningTeam;
        resultSubmitted = true;

        emit ResultSubmitted(winningTeam);
    }

    function distributeWinnings() external onlyOwner {
        require(resultSubmitted, "Result not submitted yet");
        
        uint256 totalPool = totalBetsTeamA + totalBetsTeamB;
        uint256 winningPool = winningTeam == 0 ? totalBetsTeamA : totalBetsTeamB;
        require(winningPool > 0, "No bets on the winning team");

        for (uint256 i = 0; i < bets.length; i++) {
            if (bets[i].chosenTeam == winningTeam) {
                uint256 winningShare = (bets[i].amount * totalPool) / winningPool;
                winnings[bets[i].bettor] += winningShare;
            }
        }

        emit WinningsDistributed(totalPool);
    }

    function withdrawWinnings() external {
        uint256 amount = winnings[msg.sender];
        require(amount > 0, "No winnings to withdraw");

        winnings[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }

    function getBets() external view returns (Bet[] memory) {
        return bets;
    }
}