import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { useNavigate } from "react-router-dom";
import { ABI, ADDRESS } from "../contract";
import { createEventListeners } from "./createEventListeners";
import { GetParams } from "../utils/onboard";
const GlobalContext = createContext();

export const GlobalContextProvider = ({children}) => {
    const [walletAddress, setWalletAddres] = useState('');
    const [provider, setProvider] = useState('');
    const [contract, setContract] = useState('');
    const [showAlert, setShowAlert] = useState({ status: false , type: 'info', message: '' }); 
    const [battleName, setBattleName] = useState('');
    const [gameData, setGameData] = useState({
        players: [], pendingBattles: [], activeBattle: null
    });
    const [updateGameData, setUpdateGameData] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [step, setStep] = useState(0);
    const [battleGround, setBattleGround] = useState('bg-astral');
    const navigate = useNavigate();
    const updateCurrentWalletAddress = async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts.length > 0) {
            setWalletAddres(accounts[0]);
        }

    }

    const player1Ref = useRef();
    const player2Ref = useRef();

    useEffect(() => {
        const battleGroundFromLocalstorage = localStorage.getItem('battleGround');
        if (battleGroundFromLocalstorage) {
            setBattleGround(battleGroundFromLocalstorage);
        } else {
            localStorage.setItem('battleGround', 'bg-astral');
        }
    }, [])

    useEffect(() => {
        const resetParams = async () => {
            const currentStep = await GetParams();

            setStep(currentStep.step);
        }

        resetParams();
        window?.ethereum?.on('chainCHanged', () => resetParams());
        window?.ethereum?.on('acccountCHanged', () => resetParams());
    }, [])

    useEffect(() => {
        updateCurrentWalletAddress();
        window?.ethereum?.on('accountsChanged', () => updateCurrentWalletAddress());
    }, []);

    useEffect(() => {
        const setSmartContractAndProvider = async () => {
            const web3modal = new Web3Modal();
            const connection = await web3modal.connect();
            const newProvider = new ethers.providers.Web3Provider(connection);
            const signer = newProvider.getSigner();
            const newContract = new ethers.Contract(ADDRESS, ABI, signer);
            setProvider(newProvider);
            setContract(newContract);
        }

        setSmartContractAndProvider();
    }, []);

    useEffect(() => {
        if(step != -1 && contract) {
            createEventListeners({ navigate, contract, provider, walletAddress, setShowAlert, setUpdateGameData, player1Ref, player2Ref });
        }
    },[contract, step]);

    useEffect(() => {
        if (showAlert?.status) {
            const timer = setTimeout(() => {
                setShowAlert({ status: false, type: 'info', message: '' });
            }, [5000]);
            return () => clearTimeout(timer);
        }
    }, [showAlert]);

    useEffect(() => {
        if(errorMessage) {
            const parsedErrorMessage = errorMessage?.reason?.slice('execution reverted: '.length).slice(0, -1);
            if (parsedErrorMessage){
                setShowAlert({ status: true, type: 'error', message: parsedErrorMessage });
            }
        }
    }, [errorMessage]);

    useEffect(() => {
        const fetchGameData = async () => {
            const fetchedBattles = await contract.getAllBattles();
            const pendingBattles = fetchedBattles.filter(battle => battle.battleStatus === 0);        

            let activeBattle = null;
            fetchedBattles.forEach(battle => {
                if(battle.players.find(player => player.toLowerCase() === walletAddress.toLowerCase())) {
                    if(battle.winner.startsWith('0x00')) {
                        activeBattle = battle
                    }
                }
                
            })

            console.log(fetchedBattles);
            setGameData({ pendingBattles: pendingBattles.splice(1), activeBattle });
        }
        
        if (contract) fetchGameData();
        
    }, [contract, updateGameData]);

    return (
        <GlobalContext.Provider value={{
            contract, walletAddress, showAlert, setShowAlert, 
            battleName, setBattleName, gameData, 
            battleGround, setBattleGround, 
            errorMessage, setErrorMessage,
            player1Ref, player2Ref, updateCurrentWalletAddress

        }}>
        {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => useContext(GlobalContext)