import { SSE } from "express-sse";
import { v4 as uuid } from "uuid";
import getLogger from "./Logging";
import { Logger } from "winston";
import wiki from "wikijs";

interface GamePlayer {
    name: string;
    token: string;
    score: number;
    isMaster: boolean;
    stream?: SSE;
    currentArticle?: string;
}

const TIME_TO_READ = 3 * 60000;
const ROUND_PAUSE_TIME = 15000;

export class Game {
    private state: "lobby"|"reading"|"discussion"|"finished" = "lobby";
    private players: Map<string, GamePlayer> = new Map(); // token -> player
    private log: Logger;
    private activeArticle?: string;
    private roundNumber = 0;
    constructor(public readonly name: string, private roundCount: number) {
        this.log = getLogger("Game", { name });
    }

    public get allPlayers() {
        return [...this.players.values()];
    }

    public addPlayer(nickname: string, token: string) {
        if (this.state !== "lobby") {
            throw Error("Game has already started");
        }
        if (!this.players.has(token)) {
            throw Error("Player already exists");
        }
        this.players.set(token, {
            name: nickname,
            token,
            isMaster: false,
            score: 0,
        });
        this.broadcast("new-player", {
            name: nickname,
        });
    }

    public addPlayerStream(token: string, stream: SSE) {
        const player = this.players.get(token);
        if (!player) {
            throw Error('Player not found');
        }
        this.log.debug(`Adding new player stream ${player.name}`);
        player.stream = stream;
        this.players.set(token, player);
    }

    public broadcast(eventType: string, content: any) {
        this.log.info(`Broadcasting ${eventType} to players`);
        this.log.debug(content);
        for (const [user, players] of this.players.entries()) {
            players.stream?.send(content, eventType, uuid());
        }
    }

    public startGame() {
        if (this.state !== "lobby") {
            throw Error("Game has already started");
        }
        if (this.players.size < 2) {
            throw Error("You need at least two players to start");
        }
        this.log.info(`Starting new game with ${this.players.size} players`);
        this.startNewRound();
    }

    public async startNewRound() {
        this.roundNumber++;
        // First, elect the game master.
        const masterIndex = Math.floor(Math.random()*this.players.size + 1);
        let articleIndex = Math.floor(Math.random()*this.players.size + 1);
        while (articleIndex === masterIndex) {
            articleIndex = Math.floor(Math.random()*this.players.size + 1);
        }
        const keys = [...this.players.keys()]
        // Pick for everyone or just the one who needs it.
        const articles: string[] = await wiki().random(this.activeArticle ? 1 : this.players.size);
        for (let i = 0; i < this.players.size; i++) {
            const player = this.players.get(keys[i])!;
            player.isMaster = (i === masterIndex);
            if (!this.activeArticle) {
                player.currentArticle = articles[i];
            } else if (this.activeArticle === player.currentArticle) {
                player.currentArticle = articles[0];
            }
            if (i === articleIndex) {
                this.activeArticle = player.currentArticle;
            }
            this.players.set(player.token, player);
            player.stream?.send({
                gameMaster: this.players.get(keys[masterIndex])!.name,
                article: player.currentArticle,
                roundNumber: this.roundNumber,
                readFor: TIME_TO_READ,
            }, "new-round", uuid());
        }
        this.state = "reading";
        setTimeout(() => {
            this.broadcast("discussion", { });
        }, TIME_TO_READ);
    }

    public async isPlayerMaster(token: string) {
        return this.players.get(token)?.isMaster || false;
    }

    public async pickPlayer(nickname: string) {
        const findPlayer = [...this.players.values()].find((p) => p.name === nickname)!;
        const gameMaster = [...this.players.values()].find((p) => p.isMaster)!;
        findPlayer.score++;
        const correct = findPlayer?.currentArticle === this.activeArticle;
        const finished = this.roundCount === this.roundNumber;
        this.broadcast("end-round", {
            guessCorrect: correct,
            guessPlayer: nickname,
            finished,
            pauseFor: ROUND_PAUSE_TIME,
        });
        if (correct) {
            gameMaster.score++;
        }
        if (finished) {
            this.state = "finished";
            return;
        }
        setTimeout(() => {
            this.startNewRound();
        }, ROUND_PAUSE_TIME);
    }

    public async discountPlayer(nickname: string) {
        // Does nothing yet, really.
        this.broadcast("player-discounted", {
            nickname,
        });
    }
}