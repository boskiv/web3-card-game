import React from 'react'
import styles from '../styles'
import { useNavigate } from 'react-router-dom'
import {Alert} from '../components'
import { battlegrounds } from '../assets'
import { useGlobalContext } from '../context'

const Battleground = ({}) => {
    const { showAlert, setShowAlert, setBattleGround } = useGlobalContext()
    const navigate = useNavigate()
    const handleBattlegroundChoice = (battleground) => {
        setBattleGround(battleground.id)
        localStorage.setItem('battleGround', battleground.id)

        setShowAlert({status: true, message: 'Battleground selected successfully', type: 'info'})
        setTimeout(() => {
            navigate(-1)
        }, 1000)
    }

  return (
    
    <div className={`${styles.flexCenter} ${styles.battlegroundContainer}`}>
        {showAlert?.status && <Alert type={showAlert.type} message={showAlert.message} />}
        <h1 className={`${styles.headText} text-center`}>
            Choose your <span className='text-siteViolet'>Battle </span>ground
        </h1>

        <div className={`${styles.flexCenter} ${styles.battleGroundsWrapper}`}>
            {battlegrounds.map((bg) => (
                <div 
                    key={bg.id}
                    className={`${styles.flexCenter} ${styles.battleGroundCard}`}
                    onClick={() => handleBattlegroundChoice(bg)}
                >
                    <img src={bg.image} alt={bg} className={styles.battleGroundCardImg}/>

                    <div className='info absolute'>
                        <p className={styles.battleGroundCardText}>
                            {bg.name}
                        </p>

                    </div>

                </div>
            ))}
        </div>
    </div>
  )
}

export default Battleground