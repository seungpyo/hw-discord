import React, { useEffect, useState } from "react";
import "./UserList.css";
import { User } from "./types";
import { useAppContext } from "./Context";

const UserList = () => {
  const { me, setMe } = useAppContext();
  return (
    <div className="user-list">
      <h2>Users</h2>
      <ul>
        <li>{me?.name} (You)</li>
        {/* Other users can be listed here */}
      </ul>
    </div>
  );
};

export default UserList;
