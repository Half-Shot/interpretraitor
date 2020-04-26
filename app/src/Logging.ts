import winston, { createLogger, transports } from "winston";
import { Format } from "logform";
import expressWinston from "express-winston";

const timestampFormat = winston.format.timestamp({
    format: "HH:mm:ss:SSS",
});

const consoleTransport = new winston.transports.Console({
    format: winston.format.combine(
        timestampFormat,
        winston.format.printf(
        (info) => {
            const gameName = info.gameName || "";
            return `${info.level.toUpperCase()} ${info.timestamp} [${info.module}] ${gameName} ${info.message}`;
        },
    )),
})

export function expressLogger() {
    return expressWinston.logger({
        transports: [ consoleTransport ],
        baseMeta: {
            module: 'http',
        },
        meta: true,
        expressFormat: true,
        colorize: true,
    });
}

export default function getLogger(module: string, metadata?: {[key: string]: string}) {
    return winston.createLogger({
        defaultMeta: {
            module,
            ...metadata,
        },
        transports: [
            consoleTransport,
        ],
    });
}