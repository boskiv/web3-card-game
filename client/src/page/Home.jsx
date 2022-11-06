import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHOC, CustomInput, CustomButton } from "../components";
import { useGlobalContext } from "../context";

const Home = () => {
  const { contract, walletAddress, setShowAlert, gameData, setErrorMessage } = useGlobalContext();
  const [playerName, setPlayerName] = useState("");
  const navigate = useNavigate();
  const handleClick = async () => {
    try {
      const playerExist = await contract.isPlayer(walletAddress);
      if (!playerExist) {
        await contract.registerPlayer(playerName, playerName, {
          gasLimit: 200000,
        });
        setShowAlert({
          status: true,
          type: "info",
          message: `${playerName} is been summoned`,
        });
      }
    } catch (error) {
      setErrorMessage({
        status: true,
        type: "error",
        message: "Something went wrong",
      });
    }
  };

  useEffect(() => {
    const checkForPlayerToken = async () => {
      const playerExist = await contract.isPlayer(walletAddress);
      const playerTokenExist = await contract.isPlayerToken(walletAddress);

      if (playerExist && playerTokenExist) {
        navigate("/create-battle");
      }
    };
    if (contract) checkForPlayerToken();
  }, [contract]);

  useEffect(() => {
    if(gameData.activeBattle) {
      navigate(`/battle/${gameData.activeBattle.name}`)
    }
  }, [gameData]);

  return (
    <div className="flex flex-col">
      <CustomInput
        label="Name"
        placeholder="Enter your name"
        value={playerName}
        handleValueChange={setPlayerName}
      />
      <CustomButton
        title="Register"
        handleClick={handleClick}
        restStyles="mt-6"
      />
    </div>
  );
};

export default PageHOC(
  Home,
  <>
    Welcome to Avax Gods
    <br /> a Web3 NFT Card Game
  </>,
  <>
    Connect your waalet to start playing <br /> the ultimate Web3 Battle Card
    game
  </>
);
