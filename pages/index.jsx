import { useState, useEffect } from "react"
import { getName } from "../utils/Todo"
import { CONTRACT_ADRESS } from "../utils/config"
import Web3 from "web3"
import Bars from "../components/Bars"

function App() {
    const abi = [
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
                    "internalType": "uint64",
                    "name": "index",
                    "type": "uint64"
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
    const contractAddr = CONTRACT_ADRESS;
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [metamaskInstalled, setMetamaskInstalled] = useState(true);
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [projectName, setprojectName] = useState("");
    const [newProjectCreateLoading, setNewProjectCreateLoading] = useState(false);
    async function fetchData() {
        console.log("Statring")
        const start = new Date().getTime();
        const web3 = new Web3(window.ethereum);
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        web3.eth.defaultAccount = accounts[0];
        console.log(accounts[0]);
        const contract = new web3.eth.Contract(abi, contractAddr);
        const data = await contract.methods.getData().call();
        console.log(data);
        // iterate over data
        const todos_clone = [];
        for (let i = 0; i < data.length; i++) {
            const addr = data[i];
            getName(addr).then(data_about_contract => {
                const index = data.indexOf(data_about_contract.address);
                console.log(index);
                todos_clone[index] = {
                    name: data_about_contract.name,
                    addr: data_about_contract.address
                }
            });
        }
        const interval = setInterval(() => {
            console.log(todos_clone);

            if (todos_clone.length === data.length) {
                setTodos(todos_clone);
                setLoading(false);
                clearInterval(interval);
            }
        }, 1000);

    }

    async function createNewProject(event) {
        event.preventDefault();
        setNewProjectCreateLoading(true);
        const web3 = new Web3(window.ethereum);
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        if (projectName === "") {
            alert("Please enter a project name");
            return;
        }
        web3.eth.defaultAccount = accounts[0];
        const contract = new web3.eth.Contract(abi, contractAddr);
        try {
            const data = await contract.methods.Deploy(projectName).send({ from: accounts[0] });
            const { name, contractAddr } = data.events.NewProjectCreated.returnValues;
            console.log(todos);
            setTodos([...todos, { name, addr: contractAddr }]);
            setprojectName("");

        } catch (error) {
            console.log(error);
        }
        setNewProjectCreateLoading(false);
    }

    useEffect(async () => {
        if (!window.ethereum) {
            setMetamaskInstalled(false);
            return;
        }

        const accounts = await ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
            setLoggedIn(true);
            setUser(accounts[0]);
        }
        ethereum.on('accountsChanged', function (accounts) {
            if (accounts.length === 0) {
                setLoggedIn(false);
                setUser(null);
            } else {
                setLoggedIn(true);
                setUser(accounts[0]);
                setLoading(true);
                fetchData();
            }
        });

        fetchData();


    }, []);



    async function login() {
        await ethereum.request({ method: 'eth_requestAccounts' });
    }

    return (
        <>
            <br />
            <h1 className="text-center">
                Todo App
            </h1>
            <br />
            <div className="container">
                {
                    !metamaskInstalled ?
                        <div className="text-center">
                            <h1>
                                Please install MetaMask
                            </h1>
                            <a href="https://metamask.io/" target={"_blank"}>
                                <button className="btn btn-primary">
                                    Install MetaMask
                                </button>
                            </a>
                        </div>
                        :
                        loggedIn ?
                            <>
                                {
                                    loading ?
                                        <div className="text-center">

                                            <div className="spinner-border text-primary" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                        </div>
                                        :
                                        <>
                                            <div className="btn-group float-left">
                                                <button type="button" className="btn btn-danger dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                    Create New Project
                                                </button>

                                                <div className="dropdown-menu mt-3" onClick={
                                                    (e) => {
                                                        e.stopPropagation()
                                                    }
                                                }>
                                                    <form className="px-4 py-3" onSubmit={createNewProject}>
                                                        <div className="mb-3">
                                                            <label className="form-label">Project Name</label>
                                                            <input
                                                                type={"text"}
                                                                className={"form-control"}
                                                                placeholder={"Project Name"}
                                                                value={projectName}
                                                                onChange={(e) => setprojectName(e.target.value)}
                                                                required
                                                            />
                                                        </div>

                                                        {
                                                            newProjectCreateLoading ?
                                                                <div className="spinner-border text-primary" role="status">
                                                                    <span className="sr-only">Loading...</span>
                                                                </div>
                                                                :
                                                                <button type={"submit"} className={"btn btn-primary"}>
                                                                    Create
                                                                </button>
                                                        }
                                                    </form>

                                                </div>
                                            </div>
                                            <br />
                                            <br />
                                            <Bars data={todos} setTodoFunction={setTodos} />
                                        </>

                                }
                            </>
                            :
                            <div className="text-center">
                                <button onClick={login} className="btn btn-primary">
                                    Login
                                </button>
                            </div>
                }
            </div >
        </>
    )
}

export default App;
