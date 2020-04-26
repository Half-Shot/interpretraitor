
declare module 'express-sse' {
    interface SSEOptions {
        isSerialized: boolean;
    }

    class SSE {
        constructor(initialContent: string|string[], options?: SSEOptions);
        init(req: Express.Request, res: Express.Response): void;
        updateInit(initialContent: string|string[]): void;
        dropInit(): void;
        send(content: string|any, event: string, id: string|number): void;
    }
}