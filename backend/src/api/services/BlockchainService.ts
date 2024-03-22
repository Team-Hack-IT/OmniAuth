import { TronWeb } from "tronweb";
import * as ContractABI from "../../../../smartContract/artifacts...MyContract.json";
import dotenv from "dotenv";

dotenv.config();

const tronWeb = new TronWeb({
    fullHost: process.env.CONTRACT_URL,
});

const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = tronWeb.contract(ContractABI.abi, contractAddress);

export function registerUser() {
    contract
        .registerUser()
        .send({
            feeLimit: 1_000_000,
            callValue: 0,
            shouldPollResponse: true,
        })
        .then((result: any) => {
            console.log("User registered:", result);
        })
        .catch((error: any) => {
            console.error("Error registering user:", error);
        });
}

export function approveUser(userId: number) {
    contract
        .approveUser(userId)
        .send({
            feeLimit: 1_000_000,
            callValue: 0,
            shouldPollResponse: true,
        })
        .then((result: any) => {
            console.log("User approved:", result);
        })
        .catch((error: any) => {
            console.error("Error approving user:", error);
        });
}

export function setData(data: string) {
    contract
        .setData(data)
        .send({
            feeLimit: 1_000_000,
            callValue: 0,
            shouldPollResponse: true,
        })
        .then((result: any) => {
            console.log("Data set:", result);
        })
        .catch((error: any) => {
            console.error("Error setting data:", error);
        });
}

export function getOwner() {
    contract
        .getOwner()
        .call()
        .then((result: any) => {
            console.log("Contract owner:", result);
        })
        .catch((error: any) => {
            console.error("Error getting contract owner:", error);
        });
}

export function getData() {
    contract
        .getData()
        .call()
        .then((result: any) => {
            console.log("Data:", result);
        })
        .catch((error: any) => {
            console.error("Error getting data:", error);
        });
}
