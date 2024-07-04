"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const ioredis_1 = __importDefault(require("ioredis"));
const pub = new ioredis_1.default("rediss://default:AdZuAAIncDE4YTk2MDQ2YjkxM2M0N2RlYWU2MjM3MjU3ZWFhMTlmOXAxNTQ4OTQ@strong-eagle-54894.upstash.io:6379");
const sub = new ioredis_1.default("rediss://default:AdZuAAIncDE4YTk2MDQ2YjkxM2M0N2RlYWU2MjM3MjU3ZWFhMTlmOXAxNTQ4OTQ@strong-eagle-54894.upstash.io:6379");
class SocketService {
    constructor() {
        this.connectedUsers = new Map();
        console.log("INIT SOCKET SERVER...");
        this._io = new socket_io_1.Server({
            pingTimeout: 120000,
            cors: {
                allowedHeaders: ["*"],
                origin: "*",
            },
        });
        sub.subscribe("MESSAGES");
    }
    get io() {
        return this._io;
    }
    handleUserConnection(socket) {
        socket.on("user-join", ({ user }) => {
            console.log("{user}", user);
            const newUser = {
                socketId: socket.id,
                userName: user.userName,
                id: user.id,
                imageUrl: user.imageUrl,
            };
            this.connectedUsers.set(socket.id, newUser);
            this._io.emit("connected-users", Array.from(this.connectedUsers.values()));
        });
        socket.on("disconnect", () => {
            this.connectedUsers.delete(socket.id);
            this._io.emit("connected-users", Array.from(this.connectedUsers.values()));
        });
    }
    handleJoinChat(socket) {
        socket.on("create-room", (user) => {
            socket.join(user.id);
            socket.emit(`[Connect to room] ${user.id}`);
        });
        socket.on("join-room", (room) => {
            socket.join(room);
            console.log("[User Joined Room]" + room);
        });
        socket.off("create-room", () => {
            console.log("USER DISCONNECTED");
        });
    }
    handleUserTyping(socket) {
        socket.on("typing", (room) => socket.in(room).emit("typing"));
        socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
    }
    initListeners() {
        const io = this._io;
        this._io.use((socket, next) => {
            const user = socket.handshake.auth.user;
            if (!user) {
                return next(new Error("Invalid user"));
            }
            socket.data.user = user;
            next();
        });
        io.on("connect", (socket) => {
            console.log("[SOCKET USER]", socket === null || socket === void 0 ? void 0 : socket.data.user);
            console.log(`[NEW CONNECTION]`, socket.id);
            this.handleUserConnection(socket);
            this.handleJoinChat(socket);
            this.handleUserTyping(socket);
            socket.on("new message", (data) => {
                console.log('data', data);
                socket.in(data.receiverId).emit("message recieved", data);
                // if (!chat.users) return console.log("chat.users not defined");
                // chat.users.forEach((user:User) => {
                //   if (user.id == newMessageRecieved.sender.id) return;
                //   socket.in(user.id).emit("message recieved", newMessageRecieved);
                // });
            });
            // socket.on("event:message", async ({ message }: { message: string }) => {
            //   console.log("Message", message);
            //   // publish this message to redis
            //   await pub.publish("MESSAGES", JSON.stringify({ message }));
            // });
            // Emit all conntected user
            // const connectedUsers = [];
            // socket.on("user-join", (user) => {
            //   connectedUsers.push({
            //     id: socket.id,
            //     ...user,
            //   });
            //   io.emit("connected-users", connectedUsers);
            // });
        });
        // sub.on("message", async (channel, message) => {
        //   if (channel === "MESSAGES") {
        //     io.emit("message", message);
        //     // await prismaClient.message.create({
        //     //   data: {
        //     //     text: message,
        //     //   },
        //     // });
        //     produceMessage(message);
        //     console.log("Message produce by kafka broker");
        //   }
        // });
    }
}
exports.default = SocketService;
