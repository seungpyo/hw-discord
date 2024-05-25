import React from "react";
import "./UserList.css";

const UserList = ({ username }: { username: string }) => {
  return (
    <div className="user-list">
      <h2>Users</h2>
      <ul>
        <li>{username} (You)</li>
        {/* Other users can be listed here */}
      </ul>
    </div>
  );
};

export default UserList;
