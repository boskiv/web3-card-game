import { ethers } from "ethers";
import { defenseSound } from "../assets";
import { ABI } from "../contract";
import { playAudio, sparcle } from "../utils/animation";
const emptyAccount = '0x0000000000000000000000000000000000000000';

const AddNewEvent = (eventFilter, provider, cb) => {
    provider.removeListener(eventFilter);
    provider.on(eventFilter, (logs) => {
        const parsedLog = (new ethers.utils.Interface(ABI)).parseLog(logs);
        cb(parsedLog);
    });
}

const getCoords = (cardRef) => {
    console.log(cardRef);
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    return {
        pageX: left + width / 2,
        pageY: top + height / 2.25,
    }
}

export const createEventListeners = ({ navigate, contract, provider, walletAddress, setShowAlert, setUpdateGameData, player1Ref, player2Ref }) => {
    const NewPlayerEventFilter = contract.filters.NewPlayer();
    AddNewEvent(NewPlayerEventFilter, provider, ({args}) => {
        console.log('New player created', args)
        if(walletAddress === args.owner) {
            setShowAlert({
                status: true,
                type: 'success',
                message: 'Player has been registered successfully'
            })
        }
    })

    const NewGameTokenEventFilter = contract.filters.NewGameToken();
    AddNewEvent(NewGameTokenEventFilter, provider, ({args}) => {
        console.log('New game token created', args)
        if(walletAddress.toLowerCase() === args.owner.toLowerCase()) {
            setShowAlert({
                status: true,
                type: 'success',
                message: 'Game token has been created successfully'
            })
            navigate('/create-battle')
        }
    })

    const NewBattleEventFilter = contract.filters.NewBattle();
    AddNewEvent(NewBattleEventFilter, provider, ({args}) => {
        console.log('New battle created', args, walletAddress)

        if(
            walletAddress.toLowerCase() === args.player1.toLowerCase() 
        ||
            walletAddress.toLowerCase() === args.player2.toLowerCase()
        ) {
            navigate(`/battle/${args.battleName}`)
        }

        setUpdateGameData((prevUpdateGameData) => prevUpdateGameData + 1)

        
    })

    const BattleMoveEventFilter = contract.filters.BattleMove();
    AddNewEvent(BattleMoveEventFilter, provider, ({args}) => {
        console.log('Battle move initiated!', args)
    })

    const RoundEndedEventFilter = contract.filters.RoundEnded();
    AddNewEvent(RoundEndedEventFilter, provider, ({ args }) => {
        console.log('Round ended!', args, walletAddress);
    
        for (let i = 0; i < args.damagedPlayers.length; i += 1) {
          if (args.damagedPlayers[i] !== emptyAccount) {
            if (args.damagedPlayers[i] === walletAddress) {
              sparcle(getCoords(player1Ref));
            } else if (args.damagedPlayers[i] !== walletAddress) {
              sparcle(getCoords(player2Ref));
            }
          } else {
            playAudio(defenseSound);
          }
        }
    
        setUpdateGameData((prevUpdateGameData) => prevUpdateGameData + 1);
      });

    const BattleEndedEventFilter = contract.filters.BattleEnded();
    AddNewEvent(BattleEndedEventFilter, provider, ({args}) => {
        console.log('Battle ended!', args, walletAddress)
        if(walletAddress.toLowerCase() === args.winner.toLowerCase()) {
            setShowAlert({
                status: true,
                type: 'success',
                message: 'You won the battle!'
            })
        } else if(walletAddress.toLowerCase() === args.loser.toLowerCase()) {
            setShowAlert({
                status: true,
                type: 'error',
                message: 'You lost the battle!'
            })  
        } 
        navigate('/create-battle')
        
    })  

}