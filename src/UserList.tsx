import React, { useEffect, useState } from "react";
import "./UserList.css";
import { User } from "./types";
import { useAppContext } from "./Context";

const UserList = () => {
  const { me, activeUsers, selectedRoomId } = useAppContext();
  return (
    <div className="user-list">
      <h2>Users</h2>
      <ul>
        <li>{me?.name} (You)</li>
        {(activeUsers[selectedRoomId ?? ""] ?? [])
          .filter((u: User) => u.id !== me?.id)
          .map((u: User) => (
            <li key={u.id}>{u.name}</li>
          ))}
      </ul>
    </div>
  );
};

export default UserList;
