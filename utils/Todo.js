import Web3 from "web3"
const ProjectContractAbi = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_owner",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "bool",
                "name": "done",
                "type": "bool"
            }
        ],
        "name": "addTodo",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "newName",
                "type": "string"
            }
        ],
        "name": "editProjectName",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "newCompletion",
                "type": "bool"
            }
        ],
        "name": "editTodoCompletion",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "newName",
                "type": "string"
            }
        ],
        "name": "editTodoName",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getName",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "getTodo",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "bool",
                        "name": "done",
                        "type": "bool"
                    }
                ],
                "internalType": "struct OneManTodo.SingleTodo",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getTodoLength",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getTodos",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "bool",
                        "name": "done",
                        "type": "bool"
                    }
                ],
                "internalType": "struct OneManTodo.SingleTodo[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

const MainContractAbi = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "contractAddr",
                "type": "address"
            }
        ],
        "name": "NewProjectCreated",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "DeleteProject",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            }
        ],
        "name": "Deploy",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getData",
        "outputs": [
            {
                "internalType": "bytes[]",
                "name": "",
                "type": "bytes[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

async function getTodos(contractAddress) {
    const web3 = new Web3(window.ethereum);
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    console.log(accounts[0]);
    web3.eth.defaultAccount = accounts[0];
    const contract = new web3.eth.Contract(ProjectContractAbi, contractAddress);

    const todos = await contract.methods.getTodos().call();
    return todos
}

async function addTodo(name, done, contractAddress) {
    const web3 = new Web3(window.ethereum);
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    console.log(accounts[0]);
    web3.eth.defaultAccount = accounts[0];
    const contract = new web3.eth.Contract(ProjectContractAbi, contractAddress);
    console.log("Started putting");
    let data = await contract.methods.addTodo(name, done).send({ from: accounts[0] });
    console.log(data);
    console.log("Finished putting");
}

async function getName(contractAddress) {
    const web3 = new Web3(window.ethereum);
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    web3.eth.defaultAccount = accounts[0];
    const contract = new web3.eth.Contract(ProjectContractAbi, contractAddress);
    const name = await contract.methods.getName().call();
    return { name: name, address: contractAddress };
}

async function DeleteProject(contractAddress, index) {
    console.log(index);
    const web3 = new Web3(window.ethereum);
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    web3.eth.defaultAccount = accounts[0];
    const contract = new web3.eth.Contract(MainContractAbi, contractAddress);
    let data = await contract.methods.DeleteProject(index.toString()).send({ from: accounts[0] });
}

async function editTodoCompletion(contractAddress, index, done) {
    const web3 = new Web3(window.ethereum);
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    web3.eth.defaultAccount = accounts[0];
    const contract = new web3.eth.Contract(ProjectContractAbi, contractAddress);
    let data = await contract.methods.editTodoCompletion(index, done).send({ from: accounts[0] });
}


async function editProjectName(contractAddress, name) {
    const web3 = new Web3(window.ethereum);
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    web3.eth.defaultAccount = accounts[0];
    const contract = new web3.eth.Contract(ProjectContractAbi, contractAddress);
    let data = await contract.methods.editProjectName(name).send({ from: accounts[0] });
}


module.exports = {
    getTodos,
    addTodo,
    getName,
    DeleteProject,
    editTodoCompletion,
    editProjectName
}