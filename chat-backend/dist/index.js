"use strict";
// import http from "http";
// import SocketService from "./services/socket";
// import { startMessageConsumer } from "./services/kafka";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
// async function init() {
//   startMessageConsumer();
//   console.log("eb", process.env.DATABASE_URL);
//   const socketService = new SocketService();
//   const httpServer = http.createServer(app);
//   const PORT = process.env.PORT ?? 8000;
//   //  Attch server to the socket server
//   socketService.io.attach(httpServer);
//   //   Init HTTP Server
//   httpServer.listen(PORT, () =>
//     console.log(`HTTP SERVER STARTED AT : ${PORT}`)
//   );
//   socketService.initListeners();
// }
// init();
const http_1 = __importDefault(require("http"));
const socket_1 = __importDefault(require("./services/socket"));
const kafka_1 = require("./services/kafka");
const express_1 = __importDefault(require("express"));
const logger_1 = __importDefault(require("./helpers/logger"));
const ErrorHandler_1 = __importDefault(require("./helpers/ErrorHandler"));
const apis_1 = __importDefault(require("./apis"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Handle Cors
app.use((0, cors_1.default)({
    credentials: true,
    origin: "http://localhost:5173",
    methods: "*",
}));
// Parese cookies
app.use((0, cookie_parser_1.default)());
// Logging api call
app.use((req, res, next) => {
    logger_1.default.info(`${req.method} ${req.originalUrl}`);
    next();
});
// Health check
app.get("/check", (req, res) => {
    res.send("ALL OK!");
});
app.use("/api/v1", apis_1.default);
app.use(ErrorHandler_1.default);
// Create http server and attach to express server
const httpServer = http_1.default.createServer(app);
// Create Socket server and attach with http server
const socketService = new socket_1.default();
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 8000;
//  Attch server to the socket server
socketService.io.attach(httpServer);
//   Init HTTP Server
httpServer.listen(PORT, () => console.log(`HTTP SERVER STARTED AT : ${PORT}`));
socketService.initListeners();
(0, kafka_1.startMessageConsumer)();
