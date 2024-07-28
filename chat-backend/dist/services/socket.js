"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const ioredis_1 = __importDefault(require("ioredis"));
const kafka_1 = require("./kafka");
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
            const newUser = {
                socketId: socket.id,
                userName: user.userName,
                id: user.id,
                imageUrl: user.imageUrl,
            };
            this.connectedUsers.set(user.id, newUser);
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
            console.log(`[Connect to room] ${user.id}`);
        });
        socket.on("join-room", (room) => {
            socket.join(room);
            console.log("[User Joined Room]" + room);
        });
        socket.off("create-room", () => {
            console.log("USER DISCONNECTED");
        });
        socket.off("join-room", () => {
            console.log("USER DISCONNECTED");
        });
    }
    handleUserTyping(socket) {
        socket.on("typing", (id) => {
            const getUser = this.connectedUsers.get(id);
            if (getUser) {
                socket.to(getUser.socketId).emit("start typing");
            }
        });
        socket.on("stop typing", (id) => {
            const getUser = this.connectedUsers.get(id);
            if (getUser) {
                socket.to(getUser.socketId).emit("stop typing");
            }
        });
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
            // console.log("[SOCKET USER]", socket?.data.user);
            // console.log(`[NEW CONNECTION]`, socket.id);
            this.handleUserConnection(socket);
            this.handleJoinChat(socket);
            this.handleUserTyping(socket);
            socket.on("new message", (data) => __awaiter(this, void 0, void 0, function* () {
                console.log('data', data);
                yield pub.publish("MESSAGES", JSON.stringify(data));
            }));
        });
        sub.on("message", (channel, message) => __awaiter(this, void 0, void 0, function* () {
            if (channel === "MESSAGES") {
                const data = JSON.parse(message);
                io.in(data.receiverId).emit("message recieved", data);
                (0, kafka_1.produceMessage)(message);
                console.log("Message produce by kafka broker");
            }
        }));
    }
}
exports.default = SocketService;
