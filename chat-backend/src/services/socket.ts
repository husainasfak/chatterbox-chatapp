import { Server, Socket } from "socket.io";
import Redis from "ioredis";
import { produceMessage } from "./kafka";
import { SocketUser, User } from "../types/types";
const pub = new Redis(
  "rediss://default:AdZuAAIncDE4YTk2MDQ2YjkxM2M0N2RlYWU2MjM3MjU3ZWFhMTlmOXAxNTQ4OTQ@strong-eagle-54894.upstash.io:6379"
);
const sub = new Redis(
  "rediss://default:AdZuAAIncDE4YTk2MDQ2YjkxM2M0N2RlYWU2MjM3MjU3ZWFhMTlmOXAxNTQ4OTQ@strong-eagle-54894.upstash.io:6379"
);
class SocketService {
  private _io: Server;
  private connectedUsers: Map<string, SocketUser> = new Map();
  constructor() {
    console.log("INIT SOCKET SERVER...");
    this._io = new Server({
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

  private handleUserConnection(socket: Socket) {
    socket.on("user-join", ({ user }: { user: SocketUser }) => {
      const newUser = {
        socketId: socket.id,
        userName: user.userName,
        id: user.id,
        imageUrl: user.imageUrl,
      };
      this.connectedUsers.set(user.id, newUser);
      this._io.emit(
        "connected-users",
        Array.from(this.connectedUsers.values())
      );
    });

    socket.on("disconnect", () => {
      this.connectedUsers.delete(socket.id);
      this._io.emit(
        "connected-users",
        Array.from(this.connectedUsers.values())
      );
    });
  }

  private handleJoinChat(socket: Socket) {
    socket.on("create-room", (user: User) => {
      socket.join(user.id);
      socket.emit(`[Connect to room] ${user.id}`);
      console.log(`[Connect to room] ${user.id}`)
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

  private handleUserTyping(socket: Socket) {
    socket.on("typing", (id) => {
      const getUser = this.connectedUsers.get(id)
      if(getUser){
        socket.to(getUser.socketId).emit("start typing")
      }
      
    });
    socket.on("stop typing", (id) => {
      const getUser = this.connectedUsers.get(id)
      if(getUser){
        socket.to(getUser.socketId).emit("stop typing")
      }
    });
  }

  public initListeners() {
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

      socket.on("new message", async(data) => {
        console.log('data',data)
        
        await pub.publish("MESSAGES", JSON.stringify(data));
      });
    });
    sub.on("message", async (channel, message) => {
      if (channel === "MESSAGES") {
        const data = JSON.parse(message)
        io.in(data.receiverId).emit("message recieved", data);
        produceMessage(message);
        console.log("Message produce by kafka broker");
      }
    });
  }
}

export default SocketService;
