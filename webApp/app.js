const express = require("express");
const Web3 = require("web3");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));


// Mist 혹은 MetaMask 등을 통해 Web3가 인젝트 되었는지 확인 
if(typeof web3 !=="undefined") {
    // Mist/ MetaMask 의 프로바이더를 사용
    web3 = new Web3(web3.currentProvider);
} else {
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}


// 디폴트 계좌 설정 
web3.eth.defaultAccount = web3.eth.accounts[0];

// 컨트랙트 ABI 설정
const contract = web3.eth.contract([
	{
		"constant": false,
		"inputs": [
			{
				"name": "_name",
				"type": "string"
			},
			{
				"name": "_age",
				"type": "uint256"
			}
		],
		"name": "setUser",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getUser",
		"outputs": [
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]);

// 컨트랙트 인스턴스 설정
const contractInstance = contract.at("0x48517b8bc3141c03c929d3e4df68207d964a171e");

// 컨트랙트에 저장한 user. age 받아오기
app.get("/", function(req, res) {
    let user = contractInstance.getUser();
    res.send(String(user));
});

// 컨트랙트에 user. age 저장하기
app.post("/user", function(req, res){
    let name = req.body.name;
    let age = req.body.age;
    contractInstance.setUser(name, age);
    res.send("OK");
});

app.listen(3000, function(){
    console.log("SERVER IS RUNNING ON 3000")
});
