import React, { useState } from 'react';
import './App.css';
import Login from './Login';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import UserList from './UserList';
import CallInterface from './CallInterface';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track if the user is logged in
  const [username, setUsername] = useState(''); // State to store the username
  const [selectedRoom, setSelectedRoom] = useState(null); // State to track the selected room
  const [messages, setMessages] = useState({}); // State to store messages for each room
  const [activeCalls, setActiveCalls] = useState({}); // State to hold active calls for each room
  const [showSignOut, setShowSignOut] = useState(false); // State for displaying the sign-out option

  // Handle user login
  const handleLogin = (username) => {
    setUsername(username);
    setIsLoggedIn(true);
  };

  // Handle user sign-out
  const handleSignOut = () => {
    setIsLoggedIn(false);
    setUsername('');
    setSelectedRoom(null);
    setMessages({});
    setActiveCalls({});
    setShowSignOut(false); // Hide sign-out option on sign-out
  };

  // Handle room selection
  const handleRoomSelect = (roomId) => {
    setSelectedRoom(roomId);
  };

  // Handle sending a message
  const handleSendMessage = (room, text) => {
    const newMessage = {
      username,
      text,
      isOwn: true,
    };
    setMessages((prevMessages) => ({
      ...prevMessages,
      [room]: [...(prevMessages[room] || []), newMessage],
    }));
  };

  // Handle leaving a room
  const handleLeaveRoom = (room) => {
    if (selectedRoom === room) {
      setSelectedRoom(null);
    }
    setMessages((prevMessages) => {
      const newMessages = { ...prevMessages };
      delete newMessages[room];
      return newMessages;
    });
    setActiveCalls((prevCalls) => {
      const newCalls = { ...prevCalls };
      delete newCalls[room];
      return newCalls;
    });
  };

  // Handle initiating a call
  const handleInitiateCall = (room) => {
    const userInCall = Object.values(activeCalls).some(callUsers =>
      callUsers.some(user => user.isSelf)
    );

    if (userInCall) {
      alert('You are already in a call. Please disconnect from the current call before initiating a new one.');
      return;
    }

    setActiveCalls((prevCalls) => ({
      ...prevCalls,
      [room]: [
        { id: '1', name: username, isMuted: false, isVideoOn: true, isSelf: true },
        { id: '2', name: 'User2', isMuted: false, isVideoOn: true, isSelf: false },
        { id: '3', name: 'User3', isMuted: false, isVideoOn: true, isSelf: false }
      ]
    }));
  };

  // Handle toggling mute for self
  const handleSelfMuteToggle = (roomId, userId) => {
    setActiveCalls((prevCalls) => ({
      ...prevCalls,
      [roomId]: prevCalls[roomId].map((user) =>
        user.id === userId ? { ...user, isMuted: !user.isMuted } : user
      )
    }));
  };

  // Handle toggling video for self
  const handleSelfVideoToggle = (roomId, userId) => {
    setActiveCalls((prevCalls) => ({
      ...prevCalls,
      [roomId]: prevCalls[roomId].map((user) =>
        user.id === userId ? { ...user, isVideoOn: !user.isVideoOn } : user
      )
    }));
  };

  // Handle disconnecting self from the call
  const handleSelfDisconnect = (roomId, userId) => {
    setActiveCalls((prevCalls) => {
      const updatedUsers = prevCalls[roomId].filter((user) => user.id !== userId);
      if (updatedUsers.length === 0) {
        const newCalls = { ...prevCalls };
        delete newCalls[roomId];
        return newCalls;
      }
      return { ...prevCalls, [roomId]: updatedUsers };
    });
  };

  // Handle connecting self to a call
  const handleSelfConnect = (roomId) => {
    const userInCall = Object.values(activeCalls).some(callUsers =>
      callUsers.some(user => user.isSelf)
    );

    if (userInCall) {
      alert('You are already in a call. Please disconnect from the current call before connecting to a new one.');
      return;
    }

    setActiveCalls((prevCalls) => ({
      ...prevCalls,
      [roomId]: [
        ...(prevCalls[roomId] || []),
        { id: '1', name: username, isMuted: false, isVideoOn: true, isSelf: true }
      ]
    }));
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} /> // Render the Login component if not logged in
      ) : (
        <div className="main-app">
          <ChatList
            username={username}
            selectedRoom={selectedRoom}
            onSelectRoom={handleRoomSelect}
            onLeaveRoom={handleLeaveRoom}
            onInitiateCall={handleInitiateCall}
            setShowSignOut={setShowSignOut}
            showSignOut={showSignOut}
            handleSignOut={handleSignOut}
          />
          <div className="main-content">
            {selectedRoom && (
              <>
                {activeCalls[selectedRoom] && activeCalls[selectedRoom].length > 0 && (
                  <CallInterface
                    users={activeCalls[selectedRoom]}
                    onSelfMuteToggle={(userId) => handleSelfMuteToggle(selectedRoom, userId)}
                    onSelfVideoToggle={(userId) => handleSelfVideoToggle(selectedRoom, userId)}
                    onSelfDisconnect={(userId) => handleSelfDisconnect(selectedRoom, userId)}
                    onSelfConnect={() => handleSelfConnect(selectedRoom)}
                  />
                )}
                <ChatWindow
                  room={selectedRoom}
                  messages={messages[selectedRoom] || []}
                  onSendMessage={handleSendMessage}
                />
              </>
            )}
          </div>
          {selectedRoom && <UserList username={username} />}
        </div>
      )}
    </div>
  );
}

export default App;
