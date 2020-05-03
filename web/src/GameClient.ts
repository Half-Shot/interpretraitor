export interface PlayerInfo {
    name: string;
    score: number;
    isMaster: boolean;
    isDicounted: boolean;
    isReady: boolean;
}

export interface GameInfo {
    name: string;
    players: PlayerInfo[];
}

export interface GameClient {
    joinGame: (gameName: string, nickname: string) => Promise<null|string>;
    getGame: (gameName: string) => Promise<GameInfo>;
}

export class DummyGameClient implements GameClient {
    public async joinGame(gameName: string, nickname: string) {
        // Introduce some delay.
        await new Promise((resolve) => setTimeout(resolve, 500 * Math.random()));
        if (gameName === 'demo') {
            return null;
        }
        return "Game not found";
    }

    public async getGame(gameName: string) {
        // Introduce some delay.
        await new Promise((resolve) => setTimeout(resolve, 500 * Math.random()));
        if (gameName === 'demo') {
            return {
                name: "demo",
                players: [
                    {
                        name: "Alice",
                        score: 0,
                        isMaster: false,
                        isDicounted: false,
                    },
                    {
                        name: "Bob",
                        score: 1,
                        isMaster: false,
                        isDicounted: false,
                    },
                    {
                        name: "foo",
                        score: 0,
                        isMaster: true,
                        isDicounted: false,
                    }
                ]
            }
        }
        throw Error("Game not found");
    }

    public async subscribeToStream() {

    }
}

export class NetGameClient implements GameClient {
    public async joinGame(gameName: string, nickname: string): Promise<null|string> {
        throw Error('Not implemented');
    }

    public async getGame(gameName: string): Promise<GameInfo> {
        throw Error('Not implemented');
    }
}