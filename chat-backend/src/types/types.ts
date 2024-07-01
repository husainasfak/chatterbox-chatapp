import { NextFunction, Request, Response } from "express";

export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;

// Enums
enum RequestStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
}

enum ParticipantRole {
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  GUEST = "GUEST",
}

// User Model
export interface SocketUser {
  socketId: string;
  id: string;
  userName: string;
  imageUrl: string;
}
export interface User {
  id: string;
  userName: string;
  imageUrl: string;
  password: string;
  lastActive: Date;
  participants: PrivateParticipant[];
  sentMessages: PrivateMessage[];
  receivedMessages: PrivateMessage[];
  deletedBy: PrivateMessage[];
  createdAt: Date;
  updatedAt: Date;
  initiatorPrivateConversation: PrivateConversation[];
  recipientPrivateConversation: PrivateConversation[];
}

// PrivateConversation Model
export interface PrivateConversation {
  id: string;
  participants: PrivateParticipant[];
  messages: PrivateMessage[];
  initiator: User;
  initiatorId: string;
  recipient: User;
  recipientId: string;
  status: RequestStatus;
  createdAt: Date;
  updatedAt: Date;
}

// PrivateParticipant Model
export interface PrivateParticipant {
  id: string;
  user: User;
  userId: string;
  conversation: PrivateConversation;
  conversationId: string;
  hasSeenLatestMessage: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// PrivateMessage Model
export interface PrivateMessage {
  // id?: string;
  content: string;
  fileUrl?: string;
  // createdAt: Date;
  // updatedAt: Date;
  // isDeleted: boolean;
  // conversation: PrivateConversation;
  conversationId: string;
  // sender: User;
  senderId: string;
  // receiver?: User;
  receiverId?: string;
  // deletedBy: User;
  // deletedById: string;
}
