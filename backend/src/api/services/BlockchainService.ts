import ContractABI from "../../../../smartContract/artifacts...MyContract.json";
import { TronWeb } from "tronweb";
import dotenv from "dotenv";
import { ServerError } from "../../utils/error";

dotenv.config();

const tronWeb = new TronWeb({
    privateKey: process.env.PRIVATE_KEY,
    fullNode: process.env.FULL_NODE,
    solidityNode: process.env.SOLIDITY_NODE,
    eventServer: process.env.EVENT_SERVER,
});

const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = tronWeb.contract(ContractABI.abi, contractAddress!);

/**
 * Registers a user in the blockchain.
 * @returns {Promise<object>} A promise that resolves to the result of the registration.
 * @throws {ServerError} If an error occurs during the registration process.
 */
export function registerUser(): Promise<object> {
    return contract.methods.registerUser().send();
}

/**
 * Approves a user in the blockchain.
 *
 * @param userId - The ID of the user to be approved.
 * @returns A Promise that resolves to a boolean indicating the success of the approval.
 * @throws {ServerError} If an error occurs during the approval process.
 */
export function approveUser(userId: number): Promise<boolean> {
    return contract.eventListener
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
    contract.methods.setData(data).send({
        feeLimit: 1_000_000,
        callValue: 0,
    });
}

/**
 * Retrieves the owner of the contract.
 * @returns A Promise that resolves to the owner address.
 * @throws {ServerError} If there is an error retrieving the owner.
 */
export function getOwner() {
    return contract.methods
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
    return contract.methods
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
    return contract.methods
        .generateUniqueId()
        .call()
        .then((result: number) => {
            return result;
        })
        .catch(() => {
            throw new ServerError();
        });
}
