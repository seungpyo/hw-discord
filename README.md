# REST APIs

- All `id` fields are UUIDs.
- All APIs require token ID as Bearer token.
- All JSON object notations follow TypeScript syntax.
- All resources listed below are stored in a database.
- All resources have a unique `id` field.
- All resources can be CRUDed by POST, GET, PUT, DELETE methods.
  > e.g. POST /users, GET /users/:id, PUT /users/:id, DELETE /users/:id

## User

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  avatarUrl: string; // URL to the user's avatar image
  rooms: string[];
}
```

## Room

```typescript
interface Room {
  id: string;
  name: string;
  users: string[];
  messageIds: string[];
}
```

## Message

```typescript
interface Message {
  id: string;
  content: string;
  userId: string;
  roomId: string;
}
```

# Authentication

```mermaid
sequenceDiagram
    participant Client
    participant Server
    participant EMail
    Client->>Server: POST /auth/signup
    Server->>Client: 201 Created
    Client->>Server: POST /auth/login
    Server->>Client: 200 OK
    Client->>Server: POST /auth/signout
    Server->>Client: 200 OK
    Client->>Server: POST /auth/forgot-password
    Server->>EMail: Send email with challenge
    EMail->>Client: Email sent (challenge)
    Server->>Client: 200 OK
    Client->>Server: POST /auth/reset-password
    Server->>Client: 200 OK


```

```typescript
interface Token {
  id: string;
  userId: string;
  expiresAt: string;
}
```

```typescript
interface EmailChallenge {
  id: string;
  email: string;
  challenge: string;
  expiresAt: string;
}
```

# Authentication APIs

Except `auth/signOut`, all `/auth/*` APIs does not require authentication token.

## POST /auth/signup

```typescript
interface SignupRequest {
  name: string;
  email: string;
  password: string;
}
```

Creates a new user with the given `name`, `email`, and `password`.

### POST /auth/login

```typescript
interface LoginRequest {
  email: string;
  password: string;
}
```

Checks if the `email` and `password` are correct. If so, returns a newly created `Token`.

### POST /auth/signout

Checks if the token ID given as Bearer token is valid. If so, deletes the token to sign out the user.

### POST /auth/forgot-password

Sends an email to the given `email` with a challenge to reset the password.
After email is sent, creates a new `EmailChallenge` with the given `email` and `challenge` in DB.

### POST /auth/reset-password

```typescript
interface ResetPasswordRequest {
  email: string;
  challenge: string;
  password: string;
}
```

Updates the password of the user with the given `email` and `challenge` to the given `password`.

## Getting token on login and using it for other requests

```typescript
interface Token {
  id: string;
  userId: string;
  expiresAt: string;
}
const token: Token = await fetch("auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "chongjang@hanyang.ac.kr",
    password: "1q2w3e4r!!",
  }),
});
const fetchWithTokenRefresh = async (
  url,
  params: RequestInit,
  { email: string, password: string }
) => {
  const res = await fetch(url, {
    ...params,
    headers: {
      ...params.headers,
      Authorization: `Bearer ${token.id}`,
    },
  });
  if (res.status === 401) {
    const token = await fetch("auth/signIn", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    return fetchWithTokenRefresh(url, params, { email, password });
  }
  return res;
};

const res = await fetch("/users", {
method: "GET",
headers: {
Authorization: `Bearer ${token.id}`,
},
})
.then((res) => res.json())
.catch((err) => {
if err.status === 401 {
// Unauthorized
}
}

```

```

```
