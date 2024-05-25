import { useState } from "react";
import "./RoomModal.css";

export interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRoom: (roomName: string) => void;
  onJoinRoom: (roomId: string) => void;
  error: string | null;
}

function RoomModal({
  isOpen,
  onClose,
  onCreateRoom,
  onJoinRoom,
  error,
}: RoomModalProps) {
  const [roomName, setRoomName] = useState(""); // State to track the room name input
  const [roomId, setRoomId] = useState(""); // State to track the room ID input

  if (!isOpen) return null; // If modal is not open, return null to render nothing

  // Handle creating a room
  const handleCreate = () => {
    onCreateRoom(roomName); // Call onCreateRoom prop function with room name
    setRoomName(""); // Clear the input field
  };

  // Handle joining a room
  const handleJoin = () => {
    onJoinRoom(roomId); // Call onJoinRoom prop function with room ID
    setRoomId(""); // Clear the input field
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Create or Join a Room</h2>
        <div className="input-group">
          <input
            type="text"
            placeholder="Room Name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
        </div>
        <div className="input-group">
          <input
            type="text"
            placeholder="Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
        </div>
        {error && <div className="error-message">{error}</div>}{" "}
        {/* Display error message if any */}
        <div className="button-group">
          <button onClick={handleCreate}>Create Room</button>
          <button onClick={handleJoin}>Join Room</button>
        </div>
        <button className="close-button" onClick={onClose}>
          Close
        </button>{" "}
        {/* Button to close the modal */}
      </div>
    </div>
  );
}

export default RoomModal;
