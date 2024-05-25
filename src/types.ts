export interface Room {
  id: string;
  name: string;
}
export interface ContextMenu {
  visible: boolean;
  roomId: string | null;
  x: number;
  y: number;
}

export interface User {
  id: string;
  name: string;
  isMuted: boolean;
  isVideoOn: boolean;
  isSelf: boolean;
}

export interface UsersPerRoom {
  [roomId: string]: User[];
}

export interface Message {
  username: string | null;
  text: string;
  isOwn: boolean;
}

export interface MessagesPerRoom {
  [roomId: string]: Message[];
}
