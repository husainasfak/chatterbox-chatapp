// import http from "http";
// import SocketService from "./services/socket";
// import { startMessageConsumer } from "./services/kafka";

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

import http from "http";
import SocketService from "./services/socket";
import { startMessageConsumer } from "./services/kafka";
import express from "express";
import log from "./helpers/logger";
import ErrorHandle from "./helpers/ErrorHandler";
import apiRoutes from "./apis";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler, notFound } from "./Middleware/error";

const app = express();
app.use(express.json());

// Handle Cors
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
    methods: "*",
  })
);
// Parese cookies
app.use(cookieParser());

// Logging api call
app.use((req, res, next) => {
  log.info(`${req.method} ${req.originalUrl}`);
  next();
});

// Health check
app.get("/check", (req, res) => {
  res.send("ALL OK!");
});

app.use("/api/v1", apiRoutes);
app.use(ErrorHandle);

declare global {
  namespace Express {
    interface Request {
      user?: any; // You can specify a more specific type if you know the shape of `user`
    }
  }
}

// Create http server and attach to express server

const httpServer = http.createServer(app);

// Create Socket server and attach with http server
const socketService = new SocketService();

const PORT = process.env.PORT ?? 8000;

//  Attch server to the socket server
socketService.io.attach(httpServer);
//   Init HTTP Server
httpServer.listen(PORT, () => console.log(`HTTP SERVER STARTED AT : ${PORT}`));

socketService.initListeners();
startMessageConsumer();
