const Web3 = require("web3");
const contract = require("./contract");
// const web3 = window.web3;

const NETWORK_URL = "http://127.0.0.1:8545";
const web3 = new Web3(new Web3.providers.HttpProvider(NETWORK_URL));
let accounts = '';
async function getAccount () {
  await web3.eth.getAccounts().then(function(acc){ accounts = acc })
}

getAccount();
console.log('account', accounts)

const MemeMarketplace = new web3.eth.Contract(contract.abi, contract.address, {
  from: accounts[0]
});

export const awardMemeToken = (address, tokenMetadata, callback) => {
  console.log("mememarketplace", MemeMarketplace)
  let data = MemeMarketplace.methods
    .awardMemeToken(address, tokenMetadata)
    .encodeABI();
  web3.eth.sendTransaction(
    {
      from: accounts[0],
      to: contract.address,
      data: data,
      gas: '1000000',
    },
    function (receipt) {
      callback(null, receipt);
    }
  );
};

export const getTokenOwner = (tokenId) => {
  return new Promise((resolve, reject) => {
    let data = MemeMarketplace.methods.ownerOf(tokenId).encodeABI();

    web3.eth
      .call({
        from: accounts[0],
        to: contract.address,
        data: data,
      })
      .then((receipt) => {
        let res = web3.eth.abi.decodeParameters(["address"], receipt);
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getTokenMetadata = (tokenId) => {
  return new Promise((resolve, reject) => {
    let data = MemeMarketplace.methods.tokenURI(tokenId).encodeABI();
    web3.eth
      .call({
        from: accounts[0],
        to: contract.address,
        data: data,
      })
      .then((receipt) => {
        let res = web3.eth.abi.decodeParameters(["string"], receipt);
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getTotalSupply = () => {
  return new Promise((resolve, reject) => {
    let data = MemeMarketplace.methods.totalSupply().encodeABI();

    web3.eth
      .call({
        from: accounts[0],
        to: contract.address,
        data: data,
      })
      .then((receipt) => {
        let res = web3.eth.abi.decodeParameters(["uint256"], receipt);
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
