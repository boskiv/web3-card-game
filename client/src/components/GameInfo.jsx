import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../context'
import styles from '../styles'
import CustomButton from './CustomButton'
import { alertIcon, gameRules } from '../assets'
const GameInfo = () => {
  const { contract, gameData, setShowAlert } = useGlobalContext()
  const [toggleSidebar, setToggleSidebar] = useState(false)
  const navigate = useNavigate()
  const handleBattleExit = async () => {
    const battleName = gameData.activeBattle.name
    try {
      await contract.quitBattle(battleName)
      setShowAlert({
        show: true,
        type: 'info',
        message: `You have successfully exited the battle ${battleName}`,
      })
      navigate('/')
    } catch (error) {
      setErrorMessage(error)
    }
    

  }
  return (
    <>
      <div className={styles.gameInfoIconBox}>
        <div className={`${styles.gameInfoIcon} ${styles.flexCenter}`} onClick={() => setToggleSidebar(true)}>
          <img src={alertIcon} alt="info" className={styles.gameInfoIconImg} />
        </div>
      </div>

      <div 
        className={`${styles.gameInfoSidebar} ${toggleSidebar ? 'translate-x-0' : 'translate-x-full'} 
        ${styles.glassEffect} ${styles.flexBetween} backdrop-blur-3xl`} >
        <div className='flex flex-col'>
          <div className={styles.gameInfoSidebarCloseBox}>
            <div className={`${styles.flexCenter} ${styles.gameInfoSidebarClose}`}
            onClick={() => setToggleSidebar(false)}>
              X
            </div>
          </div>

          <h3 className={styles.gameInfoHeading}>Game Rules</h3>
          <div className='mt-3'>
            {gameRules.map((rule, index) => (
              <p key={`game-rule-${index}`} className={styles.gameInfoText}>
                <span className='font-bold'>{index + 1}</span>.&nbsp;{rule}
              </p>
            ))}
          </div>
        </div>
        <div className={`${styles.flexBetween} mt-10 gap-4 w-full`}>
              <CustomButton 
                title='Choose battleground'
                handleClick={() => navigate('/battleground')}
              />
              <CustomButton 
                title='Exit battle'
                handleClick={handleBattleExit}
              />
        </div>
      </div>
    </>
  )
}

export default GameInfo