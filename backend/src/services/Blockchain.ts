/**import Web3 from 'web3';
import * as MyContractABI from './MyContractABI.json';
import { ChainlinkNode } from '@chainlink/node'

const web3 = new Web3('http://localhost:8545');

const contractABI = MyContractABI.abi;
const contractAddress = '0xYourContractAddressHere';

const myContract = new web3.eth.Contract(contractABI, contractAddress);

async function callContractFunction() {
    const result = await myContract.methods.myMethod().call();

    console.log(result);
}

callContractFunction().catch(console.error);

async function main() {
  const node = new ChainlinkNode({
    ethereum: {
      url: 'http://localhost:8545',
      chainId: 1,
    },
    db: {
      type: 'memory',
    },
    chainlink: {
      imagePullSecretName: 'linkchainlink',
    },
  })

  await node.start()
  console.log('Chainlink node started!')
}

main().catch((error) => console.error(error))
**/