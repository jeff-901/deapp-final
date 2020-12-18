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
  const [server_contract, setServerContract] = useState(null);

  useEffect(async () => {
    const web3 = await getWeb3();
    setWeb3(web3);
    const accounts = await web3.eth.getAccounts();
    setAccounts(accounts);
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = ServerContract.networks[networkId];
    const server_instance = new web3.eth.Contract(
      ServerContract.abi,
      // deployedNetwork && deployedNetwork.address,
      ServerContract.networks["1608194219388"]["address"]
    );
    setServerContract(server_instance);
  }, [])

  function print_test(){
    server_contract.methods.callServer("call server").send({from: accounts[0]})
  }

  if (!web3) { // web3
     return <div>Loading Web3, accounts, and contract...</div>;
  }
  else {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <div className="App">
              <Main/>
            </div>
          </Route>
          <Route exact path="/booking">
            <div className="App">
              <Booking/> 
            </div>
          </Route>
          <Route exact path="/creating">
            <div className="App">
              <Creating/> 
            </div>
          </Route>
          <Route exact path="/checking">
            <div className="App">
              <Checking/> 
            </div>
          </Route>
        </Switch>
      </BrowserRouter>
      );
  }
  
  
}

export default App;
