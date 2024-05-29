import { createContext, useContext, useState, ReactNode } from "react";
import { MessagesPerRoom, Token, User, UsersPerRoom } from "./types";

interface AppContextInterface {
  me: User | null;
  setMe: (user: User | null) => void;
  selectedRoomId: string | null;
  setSelectedRoomId: (roomId: string | null) => void;
  messages: MessagesPerRoom;
  setMessages: (messages: MessagesPerRoom) => void;
  activeUsers: UsersPerRoom;
  setActiveUsers: (activeUsers: UsersPerRoom) => void;
  token: Token | null;
  setToken: (token: Token | null) => void;
}

const AppContext = createContext<AppContextInterface | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [me, setMe] = useState<User | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessagesPerRoom>({});
  const [activeUsers, setActiveUsers] = useState<UsersPerRoom>({});
  const [token, setToken] = useState<Token | null>(null);
  return (
    <AppContext.Provider
      value={{
        me,
        setMe,
        selectedRoomId,
        setSelectedRoomId,
        messages,
        setMessages,
        activeUsers,
        setActiveUsers,
        token,
        setToken,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
