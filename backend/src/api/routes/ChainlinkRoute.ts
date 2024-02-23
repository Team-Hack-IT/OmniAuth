import { Router } from "express";
import {
    getUsageId,
    makeChainlinkRequest,
} from "../services/BlockchainService";

const router = Router();

router.get("/usageId", async (req, res) => {
    try {
        const result = await getUsageId();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/chainlink-request", async (req, res) => {
    try {
        const result = await makeChainlinkRequest();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
