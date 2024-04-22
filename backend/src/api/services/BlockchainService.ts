import ContractABI from "../../../../smartContract/artifacts...MyContract.json";
import TronWeb from "tronweb";
import dotenv from "dotenv";
import { ServerError } from "../../utils/error";
import "@daochild/tronweb-typescript";

dotenv.config();

const tronWeb = new TronWeb({
    fullNode: process.env.CONTRACT_URL,
    privateKey: process.env.PRIVATE_KEY,
    eventServer: process.env.EVENT_SERVER,
    solidityNode: process.env.SOLIDITY_NODE,
});

const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = tronWeb.contract(ContractABI.abi, contractAddress!);

/**
 * Registers a user in the blockchain.
 * @returns {Promise<object>} A promise that resolves to the result of the registration.
 * @throws {ServerError} If an error occurs during the registration process.
 */
export function registerUser(): Promise<object> {
    return contract
        .registerUser()
        .send({
            feeLimit: 1_000_000,
            callValue: 0,
            shouldPollResponse: true,
        })
        .then((result: object) => {
            return result;
        })
        .catch(() => {
            throw new ServerError();
        });
}

/**
 * Approves a user in the blockchain.
 *
 * @param userId - The ID of the user to be approved.
 * @returns A Promise that resolves to a boolean indicating the success of the approval.
 * @throws {ServerError} If an error occurs during the approval process.
 */
export function approveUser(userId: number): Promise<boolean> {
    return contract
        .approveUser(userId)
        .send({
            feeLimit: 1_000_000,
            callValue: 0,
            shouldPollResponse: true,
        })
        .then((result: boolean) => {
            return result;
        })
        .catch(() => {
            throw new ServerError();
        });
}

/**
 * Sets the data in the contract.
 * @param data - The data to be set in the contract.
 */
export function setData(data: string) {
    contract
        .setData(data)
        .send({
            feeLimit: 1_000_000,
            callValue: 0,
            shouldPollResponse: true,
        })
        .catch(() => {
            throw new ServerError();
        });
}

/**
 * Retrieves the owner of the contract.
 * @returns A Promise that resolves to the owner address.
 * @throws {ServerError} If there is an error retrieving the owner.
 */
export function getOwner() {
    return contract
        .getOwner()
        .call()
        .then((result: string) => {
            return result;
        })
        .catch(() => {
            throw new ServerError();
        });
}

/**
 * Retrieves data from the contract.
 * @returns A Promise that resolves to the retrieved data.
 * @throws {ServerError} If there is an error retrieving the data.
 */
export function getData() {
    return contract
        .getData()
        .call()
        .then((result: string) => {
            return result;
        })
        .catch(() => {
            throw new ServerError();
        });
}

export function generateUniqueId() {
    return contract
        .generateUniqueId()
        .call()
        .then((result: number) => {
            return result;
        })
        .catch(() => {
            throw new ServerError();
        });
}
