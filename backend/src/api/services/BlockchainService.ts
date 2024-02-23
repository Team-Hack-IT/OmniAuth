import Web3 from "web3";
import * as MyContractABI from "../../../../smartContract/artifacts...MyContract.json";
import dotenv from "dotenv";
import http from "http";

dotenv.config();

const web3 = new Web3(process.env.BLOCKCHAIN_URL);
const contractABI = MyContractABI.abi;
const contractAddress = process.env.CONTRACT_ADDRESS;
const myContract = new web3.eth.Contract(contractABI, contractAddress);

async function getUsageId() {
    const result = await myContract.methods.usageId().call();
    console.log(result);
}

async function makeChainlinkRequest() {
    const url = process.env.CHAINLINK_URL || "None";
    const requestData = {
        jobID: "12345",
        data: {
            param1: "value1",
            param2: "value2",
        },
    };

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    };

    try {
        const response = await new Promise((resolve, reject) => {
            const req = http.request(url, options, (res) => {
                let data = "";
                res.on("data", (chunk) => {
                    data += chunk;
                });
                res.on("end", () => {
                    resolve(data);
                });
            });

            req.on("error", (error) => {
                reject(error);
            });

            req.write(JSON.stringify(requestData));
            req.end();
        });

        console.log(response);
    } catch (error) {
        console.error(error);
    }
}

async function main() {
    await getUsageId();
    await makeChainlinkRequest();
}

main().catch((error) => console.error(error));

export { getUsageId, makeChainlinkRequest };
