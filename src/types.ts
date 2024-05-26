export interface BaseResource {
  id: string;
}
export interface Room extends BaseResource {
  name: string;
}

export interface Message extends BaseResource {
  userId: string;
  username: string;
  text: string;
  isOwn: boolean;
}

export interface User extends BaseResource {
  password: string;
  email: string;
  name: string;
  isMuted: boolean;
  isVideoOn: boolean;
  isSelf: boolean;
}

export interface ContextMenu {
  visible: boolean;
  roomId: string | null;
  x: number;
  y: number;
}

export interface UsersPerRoom {
  [roomId: string]: User[];
}
export interface MessagesPerRoom {
  [roomId: string]: Message[];
}

export interface Token {
  id: string;
  userId: string;
  expiresAt: string;
}

export interface EmailChallenge {
  id: string;
  email: string;
  challenge: string;
  expiresAt: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ResetPasswordRequest {
  email: string;
  challenge: string;
  password: string;
}
