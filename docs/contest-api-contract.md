# Contest API Contract

## POST /api/contest/create

Authentication: Yes

Request Body

```json
[
  {
    "title": "Weekly Contest",
    "description": "A timed programming contest.",
    "problems": ["PROBLEM_ID"],
    "registeredUsers": ["USER_ID"],
    "startTime": "2026-08-01T10:00:00.000Z",
    "endTime": "2026-08-01T12:00:00.000Z",
    "createdBy": "USER_ID",
    "isActive": true
  }
]
```

Path Parameters

None.

Query Parameters

None.

Success Response

```json
{
  "message": "Contest created successfully"
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
  "message": "All fields are required"
}
```

```json
{
  "message": "Start time must be before end time"
}
```

```json
{
  "message": "Start time must be in the future"
}
```

```json
{
  "message": "Internal server error",
  "error": "ERROR_MESSAGE"
}
```

HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 201 | Contest created successfully |
| 400 | Required fields missing or invalid contest time |
| 401 | Unauthorized |
| 500 | Internal server error |

## GET /api/contest/getAllContests

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
  "message": "Contests fetched successfully",
  "contests": [
    {
      "_id": "CONTEST_ID",
      "title": "Weekly Contest",
      "description": "A timed programming contest.",
      "problems": ["PROBLEM_ID"],
      "registeredUsers": ["USER_ID"],
      "startTime": "2026-08-01T10:00:00.000Z",
      "endTime": "2026-08-01T12:00:00.000Z",
      "createdBy": "USER_ID",
      "isActive": true,
      "createdAt": "2026-07-31T00:00:00.000Z"
    }
  ]
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
  "message": "Internal server error",
  "error": "ERROR_MESSAGE"
}
```

HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Contests fetched successfully |
| 401 | Unauthorized |
| 500 | Internal server error |

## GET /api/contest/getContestById/:id

Authentication: Yes

Request Body

Not applicable.

Path Parameters

| Name | Type | Required |
|------|------|----------|
| id | string | Yes |

Query Parameters

None.

Success Response

```json
{
  "message": "Contest fetched successfully",
  "contest": {
    "_id": "CONTEST_ID",
    "title": "Weekly Contest",
    "description": "A timed programming contest.",
    "problems": ["PROBLEM_ID"],
    "registeredUsers": ["USER_ID"],
    "startTime": "2026-08-01T10:00:00.000Z",
    "endTime": "2026-08-01T12:00:00.000Z",
    "createdBy": "USER_ID",
    "isActive": true,
    "createdAt": "2026-07-31T00:00:00.000Z"
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
  "message": "Contest not found"
}
```

```json
{
  "message": "Internal server error",
  "error": "ERROR_MESSAGE"
}
```

HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Contest fetched successfully |
| 401 | Unauthorized |
| 404 | Contest not found |
| 500 | Internal server error |

## POST /api/contest/registerUser/:id

Authentication: Yes

Request Body

Not applicable.

Path Parameters

| Name | Type | Required |
|------|------|----------|
| id | string | Yes |

Query Parameters

None.

Success Response

```json
{
  "message": "User registered for contest successfully",
  "contest": {
    "_id": "CONTEST_ID",
    "title": "Weekly Contest",
    "registeredUsers": ["USER_ID"]
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
  "message": "Contest ID and User ID are required"
}
```

```json
{
  "message": "Contest not found"
}
```

```json
{
  "message": "User already registered for this contest"
}
```

```json
{
  "message": "Internal server error",
  "error": "ERROR_MESSAGE"
}
```

HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | User registered successfully |
| 400 | Contest/user id missing or user already registered |
| 401 | Unauthorized |
| 404 | Contest not found |
| 500 | Internal server error |

## POST /api/contest/unregisterUser/:id

Authentication: Yes

Request Body

Not applicable.

Path Parameters

| Name | Type | Required |
|------|------|----------|
| id | string | Yes |

Query Parameters

None.

Success Response

```json
{
  "message": "User unregistered from contest successfully",
  "contest": {
    "_id": "CONTEST_ID",
    "title": "Weekly Contest",
    "registeredUsers": []
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
  "message": "Contest ID and User ID are required"
}
```

```json
{
  "message": "Contest not found"
}
```

```json
{
  "message": "User not registered for this contest"
}
```

```json
{
  "message": "Internal server error",
  "error": "ERROR_MESSAGE"
}
```

HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | User unregistered successfully |
| 400 | Contest/user id missing or user not registered |
| 401 | Unauthorized |
| 404 | Contest not found |
| 500 | Internal server error |

## POST /api/contest/:contestId/submit

Authentication: Yes

Request Body

```json
{
  "code": "#include <iostream>\nint main(){return 0;}",
  "lang": "c++",
  "problemId": "PROBLEM_ID"
}
```

Path Parameters

| Name | Type | Required |
|------|------|----------|
| contestId | string | Yes |

Query Parameters

None.

Success Response

```json
{
  "message": "Code submitted Successfully",
  "output": "PROGRAM_OUTPUT",
  "solution": {
    "_id": "SOLUTION_ID",
    "problemId": "PROBLEM_ID",
    "userId": "USER_ID",
    "titleName": "Two Sum",
    "code": "CODE",
    "testCasesPassed": 2,
    "status": "Accepted",
    "submittedAt": "2026-07-31T00:00:00.000Z"
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
  "message": "error"
}
```

```json
{
  "message": "Compiler Error"
}
```

HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Contest solution submitted successfully |
| 401 | Unauthorized |
| 500 | Compiler request failed or compiler error |

## GET /api/contest/:contestId/run

Authentication: Yes

Request Body

```json
{
  "code": "#include <iostream>\nint main(){return 0;}",
  "lang": "c++",
  "problemId": "PROBLEM_ID",
  "input": "INPUT_VALUE"
}
```

Path Parameters

| Name | Type | Required |
|------|------|----------|
| contestId | string | Yes |

Query Parameters

None.

Success Response

```json
{
  "message": "Success",
  "output": "PROGRAM_OUTPUT"
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
  "message": "error"
}
```

```json
{
  "message": "Compiler Error"
}
```

HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Contest code ran successfully |
| 401 | Unauthorized |
| 500 | Compiler request failed or compiler error |

## GET /api/contest/:contestId/getSubmissions

Authentication: Yes

Request Body

Not applicable.

Path Parameters

| Name | Type | Required |
|------|------|----------|
| contestId | string | Yes |

Query Parameters

None.

Success Response

```json
{
  "message": "All submissions fetched successfully",
  "submissions": [
    {
      "title": "Two Sum",
      "lang": "c++",
      "status": "Accepted",
      "submittedAt": "2026-07-31T00:00:00.000Z",
      "solutionId": "SOLUTION_ID"
    }
  ]
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
  "message": "Contest ID and User ID are required"
}
```

```json
{
  "message": "Internal server error",
  "error": "ERROR_MESSAGE"
}
```

HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | All submissions fetched successfully |
| 400 | Contest ID and User ID are required |
| 401 | Unauthorized |
| 500 | Internal server error |

## GET /api/contest/:contestId/getTotalSolvedProblems

Authentication: Yes

Request Body

Not applicable.

Path Parameters

| Name | Type | Required |
|------|------|----------|
| contestId | string | Yes |

Query Parameters

None.

Success Response

```json
{
  "message": "Total solved problems fetched successfully",
  "totalSolved": 3
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
  "message": "Contest ID and User ID are required"
}
```

```json
{
  "message": "Internal server error",
  "error": "ERROR_MESSAGE"
}
```

HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Total solved problems fetched successfully |
| 400 | Contest ID and User ID are required |
| 401 | Unauthorized |
| 500 | Internal server error |
