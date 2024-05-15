# REST APIs

> All `id` fields are UUIDs.
> All APIs require token ID as Bearer token.
> All JSON object notations follow TypeScript syntax.

## User

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  avatarUrl: string;
  rooms: string[];
}
```

## GET /users

### Query Parameters

#### Required

- sfds

#### Optional

- `name` Filter by name.
- `email` Filter by email.

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
