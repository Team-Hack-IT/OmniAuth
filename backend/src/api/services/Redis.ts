import redis from "redis";
import util from "util";

const redisClient = redis.createClient({ url: process.env.REDIS_URL });
const getAsync = util.promisify(redisClient.get).bind(redisClient);
const setAsync = util.promisify(redisClient.set).bind(redisClient);

async function getUser(sub: string) {
    const userCacheKey = `user:${sub}`;
    const cachedUser = await getAsync(userCacheKey);

    if (cachedUser) {
        return JSON.parse(cachedUser);
    }

    return null;
}

async function saveUser(sub: string, user: object) {
    const userCacheKey = `user:${sub}`;
    await setAsync(userCacheKey, JSON.stringify(user), "EX", 3600);
}

export { getUser, saveUser };
