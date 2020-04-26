export class Config {
    public web: {
        port: number,
        host: string,
    } = { 
        port: 2777,
        host: "0.0.0.0",
    }

    public redis: {
        port: number,
        host: string,
    } = { 
        port: 6379,
        host: "127.0.0.1",
    }

    public loadFromFile() {

    }
}