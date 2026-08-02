# Auth API Contract

## POST /api/auth/signup

Authentication: No

Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password1",
  "confirmPassword": "password1",
  "type": "user"
}
```

Path Parameters

None.

Query Parameters

None.

Success Response

```json
{
  "message": "User signed up successfully",
  "user": {
    "_id": "USER_ID",
    "name": "John Doe",
    "email": "john@example.com",
    "password": "HASHED_PASSWORD",
    "type": "user"
  }
}
```

Error Responses

```json
{
  "errors": ["VALIDATION_ERROR_MESSAGE"]
}
```

```json
{
  "message": "Email already exists"
}
```

```json
{
  "message": "Error creating user",
  "error": {}
}
```

HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | User signed up successfully |
| 422 | Validation failed or email already exists |
| 500 | Error creating user |

## POST /api/auth/login

Authentication: No

Request Body

```json
{
  "email": "john@example.com",
  "password": "password1"
}
```

Path Parameters

None.

Query Parameters

None.

Success Response

```json
{
  "message": "User Logged in successfully",
  "token": "JWT_TOKEN",
  "user": {
    "_id": "USER_ID",
    "name": "John Doe",
    "email": "john@example.com",
    "type": "user",
    "privacySettings": {
      "publicProfile": "public",
      "solvedProblems": "public",
      "submissionHistory": "public",
      "contestHistory": "public"
    }
  }
}
```

Error Responses

```json
{
  "message": "User does not exist"
}
```

```json
{
  "message": "Password is required"
}
```

```json
{
  "message": "Invalid email or password"
}
```

HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | User logged in successfully |
| 400 | Password is missing |
| 422 | User does not exist or credentials are invalid |

## GET /api/auth/getuser

Authentication: Yes

Request Body

Not applicable.

Path Parameters

None.

Query Parameters

None.

Success Response

```json
{
  "message": "User fetched Successfully",
  "user": {
    "_id": "USER_ID",
    "name": "John Doe",
    "email": "john@example.com",
    "type": "user",
    "privacySettings": {
      "publicProfile": "public",
      "solvedProblems": "public",
      "submissionHistory": "public",
      "contestHistory": "public"
    }
  },
  "token": "JWT_TOKEN"
}
```

Error Responses

```json
{
  "message": "Authorization header is missing"
}
```

```json
{
  "message": "Token is missing"
}
```

```json
{
  "message": "User not found"
}
```

HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | User fetched successfully |
| 401 | Authorization header missing, token missing, or user not found |

## PUT /api/users/me

Authentication: Yes

Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "privacySettings": {
    "publicProfile": "public",
    "solvedProblems": "public",
    "submissionHistory": "public",
    "contestHistory": "public"
  }
}
```

Path Parameters

None.

Query Parameters

None.

Success Response

```json
{
  "message": "Profile updated successfully",
  "user": {
    "_id": "USER_ID",
    "name": "John Doe",
    "email": "john@example.com",
    "type": "user",
    "privacySettings": {
      "publicProfile": "public",
      "solvedProblems": "public",
      "submissionHistory": "public",
      "contestHistory": "public"
    }
  }
}
```

Error Responses

```json
{
  "message": "Unauthorized"
}
```

```json
{
  "errors": ["VALIDATION_ERROR_MESSAGE"]
}
```

```json
{
  "message": "Email already exists"
}
```

```json
{
  "message": "Username already exists"
}
```

```json
{
  "errors": ["publicProfile privacy must be public or private"]
}
```

```json
{
  "message": "User not found"
}
```

```json
{
  "message": "Error updating profile",
  "error": {}
}
```

HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Profile updated successfully |
| 401 | Authorization failed |
| 404 | User not found |
| 422 | Validation failed, email already exists, or username already exists |
| 500 | Error updating profile |

New Fields

| Field | Type | Description |
|-------|------|-------------|
| privacySettings.publicProfile | string | Controls visibility of basic public profile details. Allowed values: `public`, `private`. |
| privacySettings.solvedProblems | string | Controls visibility of solved-problem totals and difficulty counts. Allowed values: `public`, `private`. |
| privacySettings.submissionHistory | string | Controls visibility of submission totals and acceptance rate. Allowed values: `public`, `private`. |
| privacySettings.contestHistory | string | Controls visibility of contest participation totals. Allowed values: `public`, `private`. |

## GET /api/auth/getSolutions

Authentication: Yes

Request Body

Not applicable.

Path Parameters

None.

Query Parameters

None.

Success Response

```json
{
  "message": "Solutions fetched successfully",
  "solutions": [
    {
      "_id": "SOLUTION_ID",
      "problemId": "PROBLEM_ID",
      "userId": "USER_ID",
      "titleName": "Two Sum",
      "code": "CODE",
      "testCasesPassed": 2,
      "status": "Accepted",
      "submittedAt": "2026-07-31T00:00:00.000Z"
    }
  ]
}
```

Error Responses

```json
{
  "message": "Authorization header is missing"
}
```

```json
{
  "message": "Token is missing"
}
```

```json
{
  "message": "Invalid token"
}
```

```json
{
  "message": "User not found"
}
```

HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Solutions fetched successfully |
| 401 | Authorization header missing, token missing, or token invalid |
| 404 | User not found |

## GET /api/users/profile/:username

Authentication: No

Request Body

Not applicable.

Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| username | string | Yes | Public profile handle. The current user model does not have a separate username field, so this matches the existing user `name` value. |

Query Parameters

None.

Success Response

```json
{
  "message": "Public profile fetched successfully",
  "user": {
    "name": "John Doe",
    "username": "John Doe",
    "type": "user"
  },
  "stats": {
    "problemsSolved": 12,
    "easySolved": 6,
    "mediumSolved": 4,
    "hardSolved": 2,
    "totalSubmissions": 30,
    "acceptedSubmissions": 18,
    "acceptanceRate": 60,
    "totalContestsParticipated": 3
  },
  "visibility": {
    "publicProfile": true,
    "solvedProblems": true,
    "submissionHistory": true,
    "contestHistory": true
  }
}
```

When a section is private for the current viewer, its related fields are omitted from `user` or `stats`, and the corresponding `visibility` value is `false`. The profile owner receives all sections when they send a valid bearer token.

Error Responses

```json
{
  "message": "Username is required"
}
```

```json
{
  "message": "User profile not found"
}
```

```json
{
  "message": "Error fetching public profile",
  "error": {}
}
```

HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Public profile fetched successfully |
| 400 | Username is missing |
| 404 | User profile does not exist |
| 500 | Error fetching public profile |

## GET /api/auth/profile

Authentication: Yes

Request Body

Not applicable.

Path Parameters

None.

Query Parameters

None.

Success Response

No JSON body. Returns plain text.

```text
This is your profile page.
```

Error Responses

No JSON body. Redirects to `/login` when unauthenticated.

HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Authenticated profile text returned |
| 302 | Redirect to `/login` when unauthenticated |

## GET /api/auth/google

Authentication: No

Request Body

Not applicable.

Path Parameters

None.

Query Parameters

None.

Success Response

No JSON body. Redirects to Google OAuth.

Error Responses

None defined.

HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 302 | Redirect to Google OAuth |

## GET /api/auth/google/callback

Authentication: No

Request Body

Not applicable.

Path Parameters

None.

Query Parameters

OAuth callback query parameters are handled by Passport.

Success Response

No JSON body. Redirects to the frontend login page with a token query parameter.

```text
{FRONTEND_URL}/login?token=JWT_TOKEN
```

Error Responses

No JSON body. Redirects to `/` on authentication failure.

HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 302 | Redirect after OAuth success or failure |
