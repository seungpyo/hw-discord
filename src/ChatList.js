import React, { useState, useEffect } from 'react';
import './ChatList.css';
import RoomModal from './RoomModal';
import { v4 as uuidv4 } from 'uuid';

function ChatList({ username, selectedRoom, onSelectRoom, onLeaveRoom, onInitiateCall, setShowSignOut, showSignOut, handleSignOut }) {
  const [rooms, setRooms] = useState([
    { id: uuidv4(), name: 'General' },
    { id: uuidv4(), name: 'Gaming' },
    { id: uuidv4(), name: 'Coding' }
  ]); // Initial list of rooms
  const [isRoomsCollapsed, setIsRoomsCollapsed] = useState(false); // State to track if the rooms list is collapsed
  const [contextMenu, setContextMenu] = useState({ visible: false, roomId: null, x: 0, y: 0 }); // State for context menu
  const [isModalOpen, setIsModalOpen] = useState(false); // State for room modal
  const [error, setError] = useState(''); // State for error messages

  // Show room modal if no rooms are available
  useEffect(() => {
    if (rooms.length === 0) {
      setIsModalOpen(true);
    }
  }, [rooms]);

  // Handle clicking outside the context menu to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenu.visible) {
        setContextMenu({ visible: false, roomId: null, x: 0, y: 0 });
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [contextMenu]);

  // Open room modal to add a new room
  const handleAddRoom = () => {
    setIsModalOpen(true);
  };

  // Toggle rooms collapse state
  const toggleRoomsCollapse = () => {
    setIsRoomsCollapsed(!isRoomsCollapsed);
  };

  // Select a room
  const handleRoomSelect = (roomId) => {
    onSelectRoom(roomId);
  };

  // Handle right-click context menu for rooms
  const handleContextMenu = (e, roomId) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      roomId,
      x: e.clientX,
      y: e.clientY,
    });
  };

  // Leave a room
  const handleLeaveRoom = () => {
    const roomToLeave = rooms.find(room => room.id === contextMenu.roomId);
    const confirmed = window.confirm(`Are you sure you want to leave the room "${roomToLeave.name}"?`);
    if (confirmed) {
      setRooms(rooms.filter((room) => room.id !== contextMenu.roomId));
      onLeaveRoom(contextMenu.roomId);
      setContextMenu({ visible: false, roomId: null, x: 0, y: 0 });
    }
  };

  // Initiate a call in a room
  const handleInitiateCall = () => {
    onInitiateCall(contextMenu.roomId);
    setContextMenu({ visible: false, roomId: null, x: 0, y: 0 });
  };

  // Show UUID of the room
  const handleShowUUID = () => {
    const room = rooms.find(room => room.id === contextMenu.roomId);
    alert(`Room ID: ${room.id}`);
    setContextMenu({ visible: false, roomId: null, x: 0, y: 0 });
  };

  // Close the context menu
  const handleCloseContextMenu = () => {
    setContextMenu({ visible: false, roomId: null, x: 0, y: 0 });
  };

  // Create a new room
  const handleCreateRoom = (roomName) => {
    const newRoom = { id: uuidv4(), name: roomName };
    setRooms([...rooms, newRoom]);
    onSelectRoom(newRoom.id);
    setIsModalOpen(false);
    setError('');
  };

  // Join an existing room
  const handleJoinRoom = (roomId) => {
    if (!roomId) {
      setError('Room ID is required to join a room.');
      return;
    }
    const newRoom = { id: roomId, name: `Room ${roomId}` };
    setRooms([...rooms, newRoom]);
    onSelectRoom(newRoom.id);
    setIsModalOpen(false);
    setError('');
  };

  // Close the room modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError('');
  };

  return (
    <div className="chat-list" onClick={handleCloseContextMenu}>
      <div className="chat-header" onClick={toggleRoomsCollapse}>
        <span className="arrow">{isRoomsCollapsed ? '﹀' : '︿'}</span>
        <span>Rooms</span>
        <button onClick={(e) => { e.stopPropagation(); handleAddRoom(); }}>+</button>
      </div>
      <div className="rooms-list">
        {!isRoomsCollapsed && (
          <ul>
            {rooms.map((room) => (
              <li
                key={room.id}
                className={room.id === selectedRoom ? 'selected' : ''}
                onClick={() => handleRoomSelect(room.id)}
                onContextMenu={(e) => handleContextMenu(e, room.id)}
              >
                {room.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="user-info">
        <span onClick={(e) => { e.preventDefault(); setShowSignOut(!showSignOut); }}>{username}</span>
        {showSignOut && (
          <div className="sign-out" onClick={handleSignOut}>
            Sign Out
          </div>
        )}
      </div>
      {contextMenu.visible && (
        <div className="context-menu" style={{ top: contextMenu.y, left: contextMenu.x }}>
          <div onClick={handleLeaveRoom}>Leave Room</div>
          <div onClick={handleInitiateCall}>Initiate Call</div>
          <div onClick={handleShowUUID}>Show Room ID</div>
        </div>
      )}
      <RoomModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCreateRoom={handleCreateRoom}
        onJoinRoom={handleJoinRoom}
        error={error}
      />
    </div>
  );
}

export default ChatList;
