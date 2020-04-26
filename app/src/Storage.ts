import redis, { Redis } from "ioredis";
import logger from "./Logging";

const log = logger("Storage");

export interface UserModel {
    id: string;
    nick: string;
}

const USER_TOKEN_STORE = "token_store";
const USER_NICK_SET = "nickname_set";

export class Datastore {
    private redis: Redis;
    constructor(port: number, host: string, options?: redis.RedisOptions) {
        this.redis = new redis(port, host, options);
    }

    public async nicknameInUse() {
        
    }

    public async getUserByToken(token: string): Promise<UserModel|null> {
        log.debug(`Fetching user for token ${token.substr(16)}`);
        const data = await this.redis.get(`${USER_TOKEN_STORE}_${token}`);
        if (!data) {
            return null;
        }
        return JSON.parse(data);
    }

    public async storeUser(token: string, userData: UserModel) {
        log.info(`Storing user ${userData.id} with token ${token.substr(16)}`);
        await this.redis.sadd(USER_NICK_SET, userData.nick);
        return this.redis.set(`${USER_TOKEN_STORE}_${token}`, JSON.stringify(userData));
    }
}