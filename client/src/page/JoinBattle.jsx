import React, { useEffect } from "react";
import { PageHOC, CustomButton } from "../components";
import { useGlobalContext } from "../context";
import { useNavigate } from "react-router-dom";
import styles from "../styles";
const JoinBattle = () => {
  const { contract, gameData, setShowAlert, setBattleName, walletAddress } =
    useGlobalContext();
  const navigate = useNavigate();
  console.log(gameData);

  useEffect(() => {
    if (gameData.activeBattle.battleStatus === 1) {
      navigate(`/battle/${gameData.activeBattle.name}`);
    }
  }, [gameData]);

  const handleClick = async (battleName) => {
    setBattleName(battleName);
    try {
      await contract.joinBattle(battleName, {gasLimit: 200000});
      setShowAlert({
        status: true,
        type: "success",
        message: `Joining ${battleName}`,
      });
      // navigate("/battleground");
    } catch (error) {
      setShowAlert({ status: true, type: "error", message: error.message });
    }
  };

  return (
    <>
      <h2 className={styles.joinHeadText}>Availible Battles:</h2>

      <div className={styles.joinContainer}>
        {gameData.pendingBattles.length ? (
          gameData.pendingBattles
            .filter((battle) => !battle.players.includes(walletAddress))
            .map((battle, index) => (
              <div key={index} className={styles.flexBetween}>
                <p className={styles.joinBattleTitle}>
                  {index + 1}. {battle.name}
                </p>
                <CustomButton
                  title="Join"
                  handleClick={() => handleClick(battle.name)}
                />
              </div>
            ))
        ) : (
          <p className={styles.joinLoading}>Reload page to see new battles</p>
        )}
      </div>

      <p className={styles.infoText} onClick={() => navigate("/create-battle")}>
        {" "}
        Or create a new battle
      </p>
    </>
  );
};

export default PageHOC(
  JoinBattle,
  <>
    Join <br /> a Battle
  </>,
  <>Join already existing battles</>
);
