import React from 'react';

function Avatar({ username }) {
  const firstLetter = username.charAt(0).toUpperCase();
  return (
    <svg width="100" height="100" viewBox="0 0 50 50"> {/* Adjusted size */}
      <circle cx="25" cy="25" r="25" fill="#5865f2" />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="24px" fontFamily="Arial">
        {firstLetter}
      </text>
    </svg>
  );
}

export default Avatar;
