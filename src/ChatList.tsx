import { useState, useEffect } from "react";
import "./ChatList.css";
import RoomModal from "./RoomModal";
import { v4 as uuidv4 } from "uuid";
import { ContextMenu, Room, Token } from "./types";

export interface ChatListProps {
  username: string;
  selectedRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
  onLeaveRoom: (roomId: string) => void;
  onInitiateCall: (roomId: string) => void;
  setShowSignOut: (show: boolean) => void;
  showSignOut: boolean;
  handleSignOut: () => void;
  getToken: () => Token | null;
}

const ChatList = ({
  username,
  selectedRoomId: selectedRoom,
  onSelectRoom,
  onLeaveRoom,
  onInitiateCall,
  setShowSignOut,
  showSignOut,
  handleSignOut,
  getToken,
}: ChatListProps) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [contextMenu, setContextMenu] = useState<ContextMenu>({
    visible: false,
    roomId: null,
    x: 0,
    y: 0,
  }); // State for context menu
  const [isModalOpen, setIsModalOpen] = useState(false); // State for room modal
  const [error, setError] = useState(""); // State for error messages

  // Show room modal if no rooms are available
  useEffect(() => {
    const listRooms = async () => {
      const res = await fetch("http://localhost:3001/api/rooms", {
        headers: {
          Authorization: `Bearer ${getToken()?.id}`,
        },
      });
      if (!res.ok) {
        const data = await res.text();
        console.error(data);
        return;
      }
      const rooms = await res.json();
      if (rooms.length === 0) {
        setIsModalOpen(true);
      }
      setRooms(rooms);
    };
    listRooms();
  }, [rooms]);

  // Handle clicking outside the context menu to close it
  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.visible) {
        setContextMenu({ visible: false, roomId: null, x: 0, y: 0 });
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [contextMenu]);

  // Open room modal to add a new room
  const handleAddRoom = () => {
    setIsModalOpen(true);
  };

  // Select a room
  const handleRoomSelect = (roomId: string) => {
    onSelectRoom(roomId);
  };

  // Handle right-click context menu for rooms
  const handleContextMenu = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    roomId: string
  ) => {
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
    const roomToLeave = rooms.find((room) => room.id === contextMenu.roomId);
    const confirmed = window.confirm(
      `Are you sure you want to leave the room "${roomToLeave?.name ?? ""}"?`
    );
    if (confirmed) {
      setRooms(rooms.filter((room) => room.id !== contextMenu.roomId));
      const roomId = contextMenu.roomId;
      if (!roomId) return;
      onLeaveRoom(roomId);
      setContextMenu({ visible: false, roomId: null, x: 0, y: 0 });
    }
  };

  // Initiate a call in a room
  const handleInitiateCall = () => {
    const roomId = contextMenu.roomId;
    if (!roomId) return;
    onInitiateCall(roomId);
    setContextMenu({ visible: false, roomId: null, x: 0, y: 0 });
  };

  // Show UUID of the room
  const handleShowUUID = () => {
    const room = rooms.find((room) => room.id === contextMenu.roomId);
    if (!room) return;
    alert(`Room ID: ${room.id}`);
    setContextMenu({ visible: false, roomId: null, x: 0, y: 0 });
  };

  // Close the context menu
  const handleCloseContextMenu = () => {
    setContextMenu({ visible: false, roomId: null, x: 0, y: 0 });
  };

  const onCreateRoom = (newRoom: Room) => {
    setRooms([...rooms, newRoom]);
    onSelectRoom(newRoom.id);
    setIsModalOpen(false);
    setError("");
  };

  // Join an existing room
  const handleJoinRoom = (roomId: string) => {
    if (!roomId) {
      setError("Room ID is required to join a room.");
      return;
    }
    const newRoom = { id: roomId, name: `Room ${roomId}` };
    setRooms([...rooms, newRoom]);
    onSelectRoom(newRoom.id);
    setIsModalOpen(false);
    setError("");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError("");
  };

  return (
    <div className="chat-list" onClick={handleCloseContextMenu}>
      <div className="chat-header">
        <span>Rooms</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAddRoom();
          }}
        >
          +
        </button>
      </div>
      <div className="rooms-list">
        <ul>
          {rooms.map((room) => (
            <li
              key={room.id}
              className={room.id === selectedRoom ? "selected" : ""}
              onClick={() => handleRoomSelect(room.id)}
              onContextMenu={(e) => handleContextMenu(e, room.id)}
            >
              {room.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="user-info">
        <span
          onClick={(e) => {
            e.preventDefault();
            setShowSignOut(!showSignOut);
          }}
        >
          {username}
        </span>
        {showSignOut && (
          <div className="sign-out" onClick={handleSignOut}>
            Sign Out
          </div>
        )}
      </div>
      {contextMenu.visible && (
        <div
          className="context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <div onClick={handleLeaveRoom}>Leave Room</div>
          <div onClick={handleInitiateCall}>Initiate Call</div>
          <div onClick={handleShowUUID}>Show Room ID</div>
        </div>
      )}
      <RoomModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCreateRoom={onCreateRoom}
        onJoinRoom={handleJoinRoom}
        error={error}
        getToken={getToken}
      />
    </div>
  );
};

export default ChatList;
