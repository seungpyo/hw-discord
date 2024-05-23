import React from 'react';
import './CallInterface.css';
import Avatar from './Avatar';

// Code used to create the call window interface
function CallInterface({ users, onSelfMuteToggle, onSelfVideoToggle, onSelfDisconnect, onSelfConnect }) {
  const self = users.find(user => user.isSelf); // Find the current user

  return (
    <div className="call-interface">
      <div className="users">
        {users.map(user => (
          <div key={user.id} className="user">
            <Avatar username={user.name} /> {/* Display user avatar */}
            <span className="username">{user.name}</span> {/* Display username */}
            {!user.isSelf && ( // Display controls only for other users
              <div className="controls">
                <button onClick={() => onSelfMuteToggle(user.id)}>
                  {user.isMuted ? 'Unmute' : 'Mute'}
                </button>
                <button onClick={() => onSelfVideoToggle(user.id)}>
                  {user.isVideoOn ? 'Turn Off Video' : 'Turn On Video'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="self-controls">
        <button onClick={() => onSelfMuteToggle(self.id)}>
          {self.isMuted ? 'Unmute' : 'Mute'}
        </button>
        <button onClick={() => onSelfVideoToggle(self.id)}>
          {self.isVideoOn ? 'Turn Off Video' : 'Turn On Video'}
        </button>
        <button onClick={() => onSelfDisconnect(self.id)}>Disconnect</button>
      </div>
    </div>
  );
}

export default CallInterface;
