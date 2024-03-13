import { Router } from "express";
import {
    getUsageId,
    makeChainlinkRequest,
} from "../services/BlockchainService";
import BusinessMiddleware from "../middleware/BusinessMiddleware";

const router = Router();

router.use("/business", BusinessMiddleware);

router.get("/businsess/usage", async (req, res) => {
    try {
        const usage = await getUsageId();
        res.status(200).json(usage);
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
