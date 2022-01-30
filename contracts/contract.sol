// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

contract OneManTodo {
	struct SingleTodo {
        string name;
        bool done;
    }

    SingleTodo[] private todos;
    address private owner;
    string private name_of_project;
    constructor (address _owner, string memory _name){
        owner = _owner;
        name_of_project = _name;
    }

    function getTodoLength() public view returns (uint) {
        require(owner == msg.sender, "Only owner can interact with it");
        return todos.length;
    }

    function getTodo(uint index) public view returns (SingleTodo memory) {
        require(owner == msg.sender, "Only owner can interact with it");
        SingleTodo memory todo = todos[index];
        return todo;
    }

    function getTodos() public view returns (SingleTodo[] memory) {
        require(owner == msg.sender, "Only owner can interact with it");
        return todos;
    }

    function addTodo(string memory name, bool done) public returns (uint){
        require(msg.sender == owner, "Only owner can edit the todos");
        SingleTodo memory currentTodo;
        currentTodo.name = name;
        currentTodo.done = done;
        todos.push(currentTodo);
        return todos.length - 1;
    }

    function getName() public view returns (string memory) {
        require(owner == msg.sender, "Only owner can interact with it");
        return name_of_project;
    }

    function editTodoName(uint index, string memory newName) public {
        require(owner == msg.sender, "Only owner can interact with it");
        todos[index].name = newName;
    }

    function editTodoCompletion(uint index, bool newCompletion) public {
        require(owner == msg.sender, "Only owner can interact with it");
        todos[index].done = newCompletion;
    }

    function editProjectName(string memory newName) public {
        require(owner == msg.sender, "Only owner can interact with it");
        name_of_project = newName;
    }
}

contract AllPeople {
  mapping(address => bytes []) userToContract;
  event NewProjectCreated (string name, address owner, address contractAddr);
  function Deploy(string memory name) public returns (address) {
    address contractAddress = address(new OneManTodo(msg.sender, name));
    userToContract[msg.sender].push(abi.encodePacked(contractAddress));
    emit NewProjectCreated(name, msg.sender, contractAddress);
    return contractAddress;
  }

  function getData() public view returns (bytes [] memory) {
      return userToContract[msg.sender];
  }

  function DeleteProject(uint256 index) public {
    for(uint i = index; i < userToContract[msg.sender].length-1; i++){
      userToContract[msg.sender][i] = userToContract[msg.sender][i+1];
    }
    userToContract[msg.sender].pop();
  }

}