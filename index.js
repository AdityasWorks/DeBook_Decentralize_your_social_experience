const Web3 = require('web3');

let web3,accounts,previousTransactionHash;

window.addEventListener("load",async()=>{
    if(window.ethereum){
        web3=new Web3(window.ethereum);
        try{
            await window.ethereum.enable();
        }catch(error){
            console.error(error);
        }
        accounts=await web3.eth.getAccounts();
        console.log("Accounts:", accounts);
        alert("Signed in with: "+accounts[0]);
    }else{
        alert("Metamask Not Installed");
    }
})

const valueInput=document.getElementById('value');
const recipientInput=document.getElementById('recipient');
const sendTransactionBtn=document.getElementById('sendTransactionBtn');

sendTransactionBtn.addEventListener("click",async()=>{
    const weiValue=web3.utils.toWei(valueInput.value,'ether');
    const recipient=recipientInput.value;
    const gasPrice=await web3.eth.getGasPrice();

    web3.eth.sendTransaction({
        from: accounts[0],
        to: recipient,
        value: weiValue,
        gasPrice: gasPrice
    })
    .on('transactionHash',function(hash){
        alert("Transaction Hash: "+hash);
        previousTransactionHash=hash;
    })
    .on('receipt',function(receipt){
        console.log(receipt);
    })
    .on('error',console.error);
})

// Function to add event listener to buttons
const addButtonClickListener = (buttonId, onClickFunction) => {
    const button = document.getElementById(buttonId);
    button.addEventListener("click", onClickFunction);
};
// JavaScript to retrieve MetaMask account number
if (typeof window.ethereum !== 'undefined') {
    ethereum.request({ method: 'eth_accounts' })
    .then(accounts => {
        document.getElementById('accountNumber').textContent = accounts[0];
    })
    .catch(err => console.error(err));
}
// Check if MetaMask is installed
if (typeof window.ethereum !== 'undefined') {
    // Add an event listener to detect when MetaMask is connected
    window.ethereum.on('accountsChanged', function (accounts) {
        // Check if there is at least one account available (user is signed in)
        if (accounts.length > 0) {
            // Redirect the user to the desired page
            window.location.href = 'main page.html'; // Replace 'new-page.html' with the URL of the page you want to redirect to
        }
    });
}
// Check if the user is authenticated (for example, by checking if a token is stored in session storage)
const isAuthenticated = sessionStorage.getItem('isAuthenticated');
document.addEventListener('DOMContentLoaded', function() {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated');
    if (isAuthenticated) {
        window.location.href = 'main-page.html';
    }
});


// If the user is authenticated, redirect them to the desired page
if (isAuthenticated) {
    window.location.href = 'main-page.html'; // Replace 'new-page.html' with the URL of the page you want to redirect to
}
document.addEventListener('DOMContentLoaded', function() {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated');
    if (isAuthenticated) {
        window.location.href = 'main-page.html';
    }
});


// 1. Fetch Transaction Details using Transaction Hash
const fetchTransactionDetails = async () => {
    try {
        const transaction = await web3.eth.getTransaction(previousTransactionHash);

        // Manually handle serialization, excluding BigInt values
        const serializedTransaction = JSON.stringify(transaction, (key, value) => {
            if (typeof value === 'bigint') {
                return value.toString(); // Convert BigInt to string
            }
            return value;
        }, 2);
z
        alert('Transaction Details:\n' + serializedTransaction);
    } catch (error) {
        console.error('Error fetching transaction details:', error);
    }
};
addButtonClickListener("fetchTransactionDetailsBtn", fetchTransactionDetails);

// 2. Display Gas Used in the Transaction
const displayGasUsed = async () => {
    try {
        const receipt = await web3.eth.getTransactionReceipt(previousTransactionHash);
        alert('Gas Used: ' + receipt.gasUsed);
    } catch (error) {
        console.error('Error fetching gas used:', error);
    }
};
addButtonClickListener("displayGasUsedBtn", displayGasUsed);

// 3. Check Expected vs Actual Gas Using estimateGas
const checkGasEstimation = async () => {
    const weiValue=web3.utils.toWei(valueInput.value,'ether');
    const recipient=recipientInput.value;
    try {
        const estimatedGas = await web3.eth.estimateGas({
            from: accounts[0],
            to: recipient,
            value: weiValue
        });

        const receipt = await web3.eth.getTransactionReceipt(previousTransactionHash);

        alert('Estimated Gas: ' + estimatedGas + '\nActual Gas Used: ' + receipt.gasUsed);
    } catch (error) {
        console.error('Error checking gas estimation:', error);
    }
};
addButtonClickListener("checkGasEstimationBtn", checkGasEstimation);

// 4. Display Balance of an Account
const displayBalance = async () => {
    try {
        const balance = await web3.eth.getBalance(accounts[0]);
        alert('Balance: ' + web3.utils.fromWei(balance, 'ether') + ' ETH');
    } catch (error) {
        console.error('Error fetching balance:', error);
    }
};
addButtonClickListener("displayBalanceBtn", displayBalance);

// 5. Generate Signature with Metamask
const generateSignature = async () => {
    const message = 'Blockchain Lab3';

    try {
        const signature = await web3.eth.personal.sign(web3.utils.fromUtf8(message), accounts[0], '');
        alert('Signature:\n' + signature);
    } catch (error) {
        console.error('Error generating signature:', error);
    }
};
addButtonClickListener("generateSignatureBtn", generateSignature);

// 6. Create a New Web3 Instance with Infura RPC URL
const createInfuraWeb3 = () => {
    const infuraRpcUrl = 'https://goerli.infura.io/v3/f41aae0e70e141eea775c2de0370e717';
    const web3Infura = new Web3(new Web3.providers.HttpProvider(infuraRpcUrl));
    alert('New Web3 instance with Infura created.');
};
addButtonClickListener("createInfuraWeb3Btn", createInfuraWeb3);

// 7. Listen for Incoming Transactions
const listenForTransactions = async () => {
    let previousTransactionCount = await web3.eth.getTransactionCount(accounts[0]);
    alert('Current Transaction Count: ' + previousTransactionCount);

    setInterval(async () => {
        const currentTransactionCount = await web3.eth.getTransactionCount(accounts[0]);

        if (currentTransactionCount > previousTransactionCount) {
            alert('New Transaction Detected!');
            previousTransactionCount = currentTransactionCount;
        }
    }, 10000); // Poll every 10 seconds, adjust as needed
};
addButtonClickListener("listenForTransactionsBtn", listenForTransactions);

// 8. Generate Random Account Address
const generateRandomAccount = () => {
    const randomAccount = web3.eth.accounts.create();
    alert('Random Account Address:\n' + randomAccount.address);
};
addButtonClickListener("generateRandomAccountBtn", generateRandomAccount);

// 9. Estimate Gas of a Transaction
const estimateGasForTransaction = async () => {
    const weiValue=web3.utils.toWei(valueInput.value,'ether');
    const recipient=recipientInput.value;
    const transactionParams = {
        from: accounts[0],
        to: recipient,
        value: weiValue
    };

    try {
        const estimatedGas = await web3.eth.estimateGas(transactionParams);
        alert('Estimated Gas for Transaction: ' + estimatedGas);
    } catch (error) {
        console.error('Error estimating gas for transaction:', error);
    }
};
addButtonClickListener("estimateGasForTransactionBtn", estimateGasForTransaction);