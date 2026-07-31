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
    "type": "user"
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
    "type": "user"
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
