import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { Switch, Route, Redirect } from "react-router-dom";
import getWeb3 from "./utils/getWeb3";
import ServerContract from "./build/contracts/Server.json"
import Main from "./containers/main"
import Creating from "./containers/creating"
import Booking from "./containers/booking"
import Checking from "./containers/checking"
import './App.css';

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [server_contract, setServerContract] = useState({methods:{}});
  const [user, setUser] = useState(false);

  useEffect(async () => {
    const web3 = await getWeb3();
    
    const accounts = await web3.eth.getAccounts();
    
    const networkId = await web3.eth.net.getId();
    // console.log(networkId);
    const deployedNetwork = ServerContract.networks[networkId];
    const server_instance = new web3.eth.Contract(
      ServerContract.abi,
      // deployedNetwork && deployedNetwork.address,
      // ServerContract.networks["1608452285837"]["address"]
      "0x45332Cd5e1cDccEB3CC0DF936aF8B5020f40c960"
    );
    // console.log(server_instance);
    setServerContract(server_instance);
    setAccounts(accounts);
    setWeb3(web3);
    // setServerContract({methods:{}});
  }, [])

  function print_test(){
    server_contract.methods.callServer("call server").send({from: accounts[0]})
  }

  if (!web3) { // web3
     return <div>Loading Web3, accounts, and contract...</div>;
  }
  else {
    // console.log(web3)
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <div className="App">
              <Main user={user} methods={server_contract.methods} accounts={accounts} setUser={setUser}/>
            </div>
          </Route>
          <Route exact path="/booking">
            <div className="App">
              <Booking user={user} methods={server_contract.methods} accounts={accounts} setUser={setUser}/> 
            </div>
          </Route>
          <Route exact path="/creating">
            <div className="App">
              <Creating user={user} methods={server_contract.methods} accounts={accounts}/> 
            </div>
          </Route>
          <Route exact path="/checking">
            <div className="App">
              <Checking user={user} methods={server_contract.methods} accounts={accounts}/> 
            </div>
          </Route>
        </Switch>
      </BrowserRouter>
      );
  }
  
  
}

export default App;
