import { useSDK } from "@metamask/sdk-react";
import { createContext, useState,useContext,useEffect } from "react";
import Web3 from "web3";
import { abi,contractAddress } from "../utils/Constants";
const initialState = {
  account: "",
  connected: false,
  connecting: false,
  connectToMetaMask:()=>{},
  provider:{},
  sdk:{},
  web3:{}
};

const ArrayAppContext=createContext(initialState);

export const ArrayAppContextProvider=({children})=>{
    const [account,setAccount]=useState("");
    const {sdk,connecting,connected,provider}=useSDK();
    const connectToMetaMask = async () => {
      try {
        const accounts = await sdk?.connect();
        setAccount(accounts?.[0]);
      } catch (err) {
        console.log(`failed to connect...`, err);
      }
    };
    const app = new Web3(provider);
  const web3 = new app.eth.Contract(abi, contractAddress);

  useEffect(() => {
    if (!account) {
      connectToMetaMask();
    }
  }, [connected]);
  return (
    <ArrayAppContext.Provider
      value={{
        account,
        connected,
        connecting,
        provider,
        sdk,
        web3,
        connectToMetaMask,
      }}
    >
      {children}
    </ArrayAppContext.Provider>
    );
}
export const useAppContext = () => useContext(ArrayAppContext);
export default ArrayAppContext;