import { useState } from "react";
import "./App.css";
import Login from "./Login";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import UserList from "./UserList";
import CallScreen from "./CallScreen";
import { UsersPerRoom, MessagesPerRoom, Token, User } from "./types";
import { v4 as uuidv4 } from "uuid";
import { useAppContext } from "./Context";
const App = () => {
  const {
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
  } = useAppContext();
  const [showSignOut, setShowSignOut] = useState(false);

  // Handle user sign-out
  const onSignOut = () => {
    setMe(null);
    setToken(null);
    setSelectedRoomId(null);
    setMessages({});
    setActiveUsers({});
    setShowSignOut(false); // Hide sign-out option on sign-out
  };

  const getToken = (): Token | null => {
    return token;
  };

  const onRoomSelect = (roomId: string) => setSelectedRoomId(roomId);

  // Handle sending a message
  const onSendMessage = (room: string, text: string) => {
    setMessages({
      ...messages,
      [room]: [
        ...(messages[room] || []),
        {
          id: uuidv4(),
          userId: token?.userId || "",
          username: me?.name || "",
          text,
          isOwn: true,
        },
      ],
    });
  };

  // Handle leaving a room
  const handleLeaveRoom = (room: string) => {
    if (selectedRoomId === room) {
      setSelectedRoomId(null);
    }
    setMessages({ ...messages, [room]: [] });
    setActiveUsers({ ...activeUsers, [room]: [] });
  };

  // Handle initiating a call
  const handleInitiateCall = (room: string) => {
    const userInCall = Object.values(activeUsers).some((callUsers) =>
      callUsers.some((user) => user?.isSelf)
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
    setActiveUsers({
      ...activeUsers,
      [roomId]: activeUsers[roomId].map((user) =>
        user.id === userId ? { ...user, isMuted: !user.isMuted } : user
      ),
    });
  };

  // Handle toggling video for self
  const handleSelfVideoToggle = (roomId: string, userId: string) => {
    setActiveUsers({
      ...activeUsers,
      [roomId]: activeUsers[roomId].map((user) =>
        user.id === userId ? { ...user, isVideoOn: !user.isVideoOn } : user
      ),
    });
  };

  // Handle disconnecting self from the call
  const handleSelfDisconnect = (roomId: string, userId: string) => {
    const otherUsersInThisRoom = activeUsers[roomId].filter(
      (user) => user.id !== userId
    );
    if (otherUsersInThisRoom.length === 0) {
      const tmp = { ...activeUsers };
      delete tmp[roomId];
      return tmp;
    }
    return {
      ...activeUsers,
      [roomId]: otherUsersInThisRoom,
    };
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
      {!me?.name ? (
        <Login
          onLogin={({ user, token }: { user: User; token: Token }) => {
            console.log("Calling onLogin");
            setMe(user);
            setToken(token);
            console.log("username", me?.name);
          }}
        /> // Render the Login component if not logged in
      ) : (
        <div className="main-app">
          <ChatList
            username={me?.name}
            selectedRoomId={selectedRoomId}
            onSelectRoom={onRoomSelect}
            onLeaveRoom={handleLeaveRoom}
            onInitiateCall={handleInitiateCall}
            setShowSignOut={setShowSignOut}
            showSignOut={showSignOut}
            handleSignOut={onSignOut}
            getToken={getToken}
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
          {selectedRoomId && <UserList />}
        </div>
      )}
    </div>
  );
};

export default App;
