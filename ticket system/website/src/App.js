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
  // const [server_contract, setServerContract] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(async () => {
    const web3 = await getWeb3();
    
    const accounts = await web3.eth.getAccounts();
    
    const networkId = await web3.eth.net.getId();
    // console.log(networkId);
    const deployedNetwork = ServerContract.networks[networkId];
    const server_instance = new web3.eth.Contract(
      ServerContract.abi,
      // deployedNetwork && deployedNetwork.address,
      // 0xD5087e00cC0338AbD7d421dF86FB88cE0155d201
      // 0x5dd794Cf643694454E4a4Fe870432D95792452E2
      // 0xf95c89c7bf95d040a8e98b8b86eb43d0097fe67e
      // ServerContract.networks["1608347804216"]["address"]
      "0x47c88334651F4d2148cD48135f523C36f4b9Dc16"
    );
    // console.log(server_instance);
    setServerContract(server_instance);
    setWeb3(web3);
    setAccounts(accounts);
    // setServerContract({methods:{}});
    // console.log(server_contract)
  }, [])

  function print_test(){
    server_contract.methods.callServer("call server").send({from: accounts[0]})
  }

  if (!web3) { // web3
    // console.log(server_contract)
     return <div>Loading Web3, accounts, and contract...</div>;
  }
  else {


    // console.log(accounts.length)
    // console.log(server_contract.methods)
    console.log("app user: ",user)
    // console.log(server_contract.methods)

    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <div className="App">
              {/* <button onClick={print_test()}/> */}
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
