import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import DebookAbi from './contractsData/Debook.json';
import DebookAddress from './contractsData/Debook-address.json';
import { Spinner } from 'react-bootstrap';
import Navbar from './Navbar';
import Home from './Home.js';
import Profile from './Profile.js';
import BrandInfo from './BrandInfo.js';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState({});

  const web3Handler = async () => {
    let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0]);

    // Setup event listeners for metamask
    window.ethereum.on('chainChanged', () => {
      window.location.reload();
    });
    window.ethereum.on('accountsChanged', async () => {
      setLoading(true);
      web3Handler();
    });

    // Get provider from Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // Get signer
    const signer = provider.getSigner();
    loadContract(signer);
  };

  const loadContract = async (signer) => {
    // Get deployed copy of Debook contract
    const contract = new ethers.Contract(DebookAddress.address, DebookAbi.abi, signer);
    setContract(contract);
    setLoading(false);
  };

  const circle = document.getElementById('circle');

  document.addEventListener('mousemove', (e) => {
      const height = circle.offsetHeight;
      const width = circle.offsetWidth;
  
      setTimeout(() => { 
          circle.style.left = `${e.pageX - width/2}px`;
          circle.style.top = `${e.pageY - height/2}px`;
      }, 50);
  });

  return (
    
    <BrowserRouter>
    
      <div id="circle" className="circle"></div>
      <div className="App">
        <div className="Ellipse2"></div>
        <div className="Ellipse1"></div>
        <div className="Ellipse3"></div>
        <Navbar account={account} web3Handler={web3Handler} />
        {!account && <BrandInfo />}
        <div className="loada">
          {loading ? (
            <div className="bg">
              <Spinner className="spin" animation="border" />
              <p className="loadb">Awaiting Metamask Connection...</p>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<Home contract={contract} />} />
              <Route path="/profile" element={<Profile contract={contract} />} />
            </Routes>
          )}
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;