import {
    createServer as httpCreateServer,
    IncomingMessage as httpIncomingMessage,
    Server as httpServer,
    ServerResponse as httpServerResponse,
} from "http"

class Http {
    static createServer(): httpServer {
        return httpCreateServer()
    }
}

// eslint-disable-next-line no-redeclare
namespace Http {
    export interface IncomingMessage extends httpIncomingMessage {}
    export interface Server extends httpServer {}
    export interface ServerResponse extends httpServerResponse {}
}

export { Http }
