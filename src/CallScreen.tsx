import "./CallInterface.css";
import Avatar from "./Avatar";
import { User } from "./types";

const UserTab = ({ user }: { user: User }) => (
  <div key={user.id} className="user">
    <Avatar username={user.name} />
    <span className="username">{user.name}</span>
  </div>
);
// Code used to create the call window interface

export interface CallScreenProps {
  users: User[];
  onSelfMuteToggle: (userId: string) => void;
  onSelfVideoToggle: (userId: string) => void;
  onSelfDisconnect: (userId: string) => void;
  onSelfConnect: () => void;
}

function CallScreen({
  users,
  onSelfMuteToggle,
  onSelfVideoToggle,
  onSelfDisconnect,
  onSelfConnect,
}: CallScreenProps) {
  const self = users.find((user) => user.isSelf); // Find the current user
  if (!self) {
    throw new Error("Current user not found in call");
  }
  return (
    <div className="call-interface">
      <div className="users">{users.map((user) => UserTab({ user }))}</div>
      <div className="self-controls">
        <button onClick={() => onSelfMuteToggle(self.id)}>
          {self.isMuted ? "Unmute" : "Mute"}
        </button>
        <button onClick={() => onSelfVideoToggle(self.id)}>
          {self.isVideoOn ? "Turn Off Video" : "Turn On Video"}
        </button>
        <button onClick={() => onSelfDisconnect(self.id)}>Disconnect</button>
      </div>
    </div>
  );
}

export default CallScreen;
