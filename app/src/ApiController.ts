import { Router, Response, Request, json } from "express";
import { v4 as uuid } from "uuid";
import { Datastore } from "./Storage";
import { SSE } from "express-sse";
import { Game } from "./Game";
import getLogger from "./Logging";

interface PostRequestReqBody {
    nickname: string,
}
interface ErrorBody {
    error: string,
}

interface PostGameJoinResBody {
    token: string,
}

interface GetGameBody {
    name: string;
    members: [];
}

const NICK_REGEX = /[\w\d  \-_]{3,16}/;
const GAME_NAME_REGEX = /[\w\d\-_]{3,16}/;

const log = getLogger("Api");

export class ApiController {
    private games: Map<string, Game> = new Map();
    constructor() { }

    public getHealth(req: Request, res: Response<string>) {
        res.status(200).header("Content-Type", "text/plain").send("😎");
    }

    public getGame(req: Request<{name: string}, {}, {}, {}>, res: Response<GetGameBody|ErrorBody>) {
        const game = this.games.get(req.param.name);
        if (!game) {
            return res.status(404).send({
                error: "Game not found",
            });
        }
        const players = game.allPlayers.map((p) => ({
            name: p.name,
            score: p.score,
            isMaster: p.isMaster,
            isDiscounted: p.isDiscounted,
        }));
        return {
            name: game.name,
            players,
        };
    }

    /**
     * Join, or create and join a game.
     */
    public postGameJoin(req: Request<{name: string}, {}, {}, {nickname: string, create: string, rounds: string}>, res: Response<PostGameJoinResBody|ErrorBody>) {
        const { nickname, create, rounds } = req.query;
        const { name } = req.param;
        if (!nickname || !NICK_REGEX.exec(nickname)) {
            return res.status(400).send({
                error: "Invalid nickname. Must be alphanumeric and be between 3 and 16 characters",
            });
        }
        if (!nickname || !GAME_NAME_REGEX.exec(name)) {
            return res.status(400).send({
                error: "Invalid game name. Must be alphanumeric and be between 3 and 16 characters",
            });
        }
        let game = this.games.get(name);
        if (!game) {
            if (!Boolean(create)) {
                return res.status(404).send({
                    error: "Game not found",
                });
            }
            game = new Game(name, Number.parseInt(rounds));
            this.games.set(name, game);
        }
        // Create a token
        const token = `AUTH_${uuid()}`;
        // Add the player
        game.addPlayer(nickname, token);
        res.json({ token });
    }

    public getGameStream(req: Request<{name: string}, {}, {}, {}>, res: Response) {
        const game = this.games.get(req.param.name);
        if (!game) {
            return res.status(404).send({
                error: "Game not found",
            });
        }
        const sse = new SSE("");
        const token = ApiController.GetToken(req);
        if (!token) {
            return res.status(401).send({
                error: "Token not found",
            });
        }
        game?.addPlayerStream(token, sse);
        sse.init(req, res);
    }

    public postGameDiscount(req: Request<{name: string}, {}, {}, {nickname: string}>, res: Response) {
        const { nickname } = req.query;
        const game = this.games.get(req.param.name);
        if (!game) {
            return res.status(404).send({
                error: "Game not found",
            });
        }
        const token = ApiController.GetToken(req);
        if (!token || !game.isPlayerMaster(token)) {
            return res.status(403).send({
                error: "You are not the game master",
            });
        }
        try {
            game.discountPlayer(nickname);
            res.status(201);
        } catch (ex) {
            log.warn("Could not discount player", ex);
            return res.status(500).send({
                error: "Could not discount player",
            });
        }
    }

    public postGamePick(req: Request<{name: string}, {}, {}, {nickname: string}>, res: Response) {
        const { nickname } = req.query;
        const game = this.games.get(req.param.name);
        if (!game) {
            return res.status(404).send({
                error: "Game not found",
            });
        }
        const token = ApiController.GetToken(req);
        if (!token || !game.isPlayerMaster(token)) {
            return res.status(403).send({
                error: "You are not the game master",
            });
        }
        try {
            game.pickPlayer(nickname);
            res.status(201);
        } catch (ex) {
            log.warn("Could not pick player", ex);
            return res.status(500).send({
                error: "Could not pick player",
            });
        }
    }

    public getRouter() {
        const router = Router();
        router.use(json()) // for parsing application/json
        router.get("/health", this.getHealth);
        router.get("/games/:name", this.getGame.bind(this));
        router.get("/games/:name/stream", this.getGameStream.bind(this));
        router.post("/games/:name/join", this.postGameJoin.bind(this));
        router.post("/games/:name/discount", this.postGameDiscount.bind(this));
        router.post("/games/:name/pick", this.postGamePick.bind(this));
        return router;
    }

    public static GetToken(req: Request) {
        return req.get("Authorization")?.substr("Bearer ".length);
    }
}