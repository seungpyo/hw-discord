import { useState } from "react";
import "./App.css";
import Login from "./Login";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import UserList from "./UserList";
import CallScreen from "./CallScreen";
import { UsersPerRoom, MessagesPerRoom } from "./types";
const App = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessagesPerRoom>({});
  const [activeUsers, setActiveUsers] = useState<UsersPerRoom>({});
  const [showSignOut, setShowSignOut] = useState(false);
  const isLoggedIn = username !== null;
  // Handle user login
  const onLogin = (username: string) => setUsername(username);

  // Handle user sign-out
  const onSignOut = () => {
    setUsername(null);
    setSelectedRoom(null);
    setMessages({});
    setActiveUsers({});
    setShowSignOut(false); // Hide sign-out option on sign-out
  };

  const onRoomSelect = (roomId: string) => setSelectedRoom(roomId);

  // Handle sending a message
  const onSendMessage = (room: string, text: string) => {
    setMessages((prevMessages) => ({
      ...prevMessages,
      [room]: [
        ...(prevMessages[room] || []),
        {
          username,
          text,
          isOwn: true,
        },
      ],
    }));
  };

  // Handle leaving a room
  const handleLeaveRoom = (room: string) => {
    if (selectedRoomId === room) {
      setSelectedRoom(null);
    }
    setMessages((prevMessages) => {
      const newMessages = { ...prevMessages };
      delete newMessages[room];
      return newMessages;
    });
    setActiveUsers((prevCalls) => {
      const newCalls = { ...prevCalls };
      delete newCalls[room];
      return newCalls;
    });
  };

  // Handle initiating a call
  const handleInitiateCall = (room: string) => {
    const userInCall = Object.values(activeUsers).some((callUsers) =>
      callUsers.some((user) => user.isSelf)
    );

    if (userInCall) {
      alert(
        "You are already in a call. Please disconnect from the current call before initiating a new one."
      );
      return;
    }
  };

  // Handle toggling mute for self
  const handleSelfMuteToggle = (roomId: string, userId: string) => {
    setActiveUsers((prevCalls) => ({
      ...prevCalls,
      [roomId]: prevCalls[roomId].map((user) =>
        user.id === userId ? { ...user, isMuted: !user.isMuted } : user
      ),
    }));
  };

  // Handle toggling video for self
  const handleSelfVideoToggle = (roomId: string, userId: string) => {
    setActiveUsers((prevCalls) => ({
      ...prevCalls,
      [roomId]: prevCalls[roomId].map((user) =>
        user.id === userId ? { ...user, isVideoOn: !user.isVideoOn } : user
      ),
    }));
  };

  // Handle disconnecting self from the call
  const handleSelfDisconnect = (roomId: string, userId: string) => {
    setActiveUsers((prevCalls) => {
      const updatedUsers = prevCalls[roomId].filter(
        (user) => user.id !== userId
      );
      if (updatedUsers.length === 0) {
        const newCalls = { ...prevCalls };
        delete newCalls[roomId];
        return newCalls;
      }
      return { ...prevCalls, [roomId]: updatedUsers };
    });
  };

  // Handle connecting self to a call
  const handleSelfConnect = (roomId: string) => {
    const userInCall = Object.values(activeUsers).some((callUsers) =>
      callUsers.some((user) => user.isSelf)
    );

    if (userInCall) {
      alert(
        "You are already in a call. Please disconnect from the current call before connecting to a new one."
      );
      return;
    }
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        <Login onLogin={onLogin} /> // Render the Login component if not logged in
      ) : (
        <div className="main-app">
          <ChatList
            username={username}
            selectedRoomId={selectedRoomId}
            onSelectRoom={onRoomSelect}
            onLeaveRoom={handleLeaveRoom}
            onInitiateCall={handleInitiateCall}
            setShowSignOut={setShowSignOut}
            showSignOut={showSignOut}
            handleSignOut={onSignOut}
          />
          <div className="main-content">
            {selectedRoomId && (
              <>
                {activeUsers[selectedRoomId]?.length > 0 && (
                  <CallScreen
                    users={activeUsers[selectedRoomId]}
                    onSelfMuteToggle={(userId) =>
                      handleSelfMuteToggle(selectedRoomId, userId)
                    }
                    onSelfVideoToggle={(userId) =>
                      handleSelfVideoToggle(selectedRoomId, userId)
                    }
                    onSelfDisconnect={(userId) =>
                      handleSelfDisconnect(selectedRoomId, userId)
                    }
                    onSelfConnect={() => handleSelfConnect(selectedRoomId)}
                  />
                )}
                <ChatWindow
                  roomId={selectedRoomId}
                  messages={messages[selectedRoomId] || []}
                  onSendMessage={onSendMessage}
                />
              </>
            )}
          </div>
          {selectedRoomId && <UserList username={username} />}
        </div>
      )}
    </div>
  );
};

export default App;
