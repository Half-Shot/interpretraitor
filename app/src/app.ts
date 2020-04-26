import { default as expressApp, static as expressStatic } from "express";
import Logger, { expressLogger } from "./Logging";
import { ApiController } from "./ApiController";
import { Config } from "./Config";
import { Datastore } from "./Storage";

const log = Logger("app");

export class LyingApp {
    public async main(argv: string[]) {
        const config = new Config();
        log.info(`Starting app`);
        //const storage = new Datastore(config.redis.port, config.redis.host);
        const express = expressApp();
        const apiController = new ApiController(/*storage*/);
        express.use(expressLogger());
        express.use("/api", apiController.getRouter());
        // Host static content
        express.use("/", expressStatic("../web/dist"));
        express.use("/.*", expressStatic("../web/dist/index.html"));
        express.listen(config.web.port, config.web.host);
        log.info(`Listening on http://${config.web.host}:${config.web.port}`);
    }   
}

new LyingApp().main(process.argv).then(() => {
    log.info("All finished");
}).catch((ex) => {
    log.error("Encountered a fatal error:", ex);
    process.exit(1);
})