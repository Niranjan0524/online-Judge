# Backend API Contract

## GET /health

Authentication: No

Request Body

Not applicable.

Path Parameters

None.

Query Parameters

None.

Success Response

```json
{
  "message": "OK"
}
```

Error Responses

None defined.

HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Health check passed |

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
  "errors": [
    "Name is Required",
    "Email is Required",
    "Password is Required",
    "Confirm Password is Required"
  ]
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
      "code": "console.log('solution')",
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

## GET /api/problem/getAllProblems

Authentication: No

Request Body

Not applicable.

Path Parameters

None.

Query Parameters

None.

Success Response

```json
{
  "message": "Problems fetched successfully",
  "problems": [
    {
      "_id": "PROBLEM_ID",
      "title": "Two Sum",
      "description": "Find two numbers that add up to target.",
      "difficulty": "easy",
      "inputFormat": ["nums", "target"],
      "outputFormat": ["indices"],
      "timeLimit": 1000,
      "tags": ["Array", "Hash Table"]
    }
  ]
}
```

Error Responses

```json
{
  "message": "No problems found"
}
```

HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Problems fetched successfully |
| 422 | No problems found |

## POST /api/problem/addTestCases

Authentication: No

Request Body

```json
[
  {
    "input": [
      {
        "name": "nums",
        "value": "[2,7,11,15]"
      }
    ],
    "output": "[0,1]",
    "problemId": "PROBLEM_ID"
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
  "message": "Test Case added successfully"
}
```

Error Responses

```json
{
  "message": "Failed to add test case",
  "error": "ERROR_MESSAGE"
}
```

HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Test cases added successfully |
| 500 | Failed to add test case |

## POST /api/problem/addProblems

Authentication: No

Request Body

```json
[
  {
    "_id": "OPTIONAL_PROBLEM_ID",
    "title": "Two Sum",
    "description": "Find two numbers that add up to target.",
    "difficulty": "easy",
    "inputFormat": ["nums", "target"],
    "outputFormat": ["indices"],
    "timeLimit": 1000,
    "tags": ["Array", "Hash Table"]
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
  "message": "Problems added successfully"
}
```

Error Responses

None defined.

HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Problems added successfully |

## GET /api/problem/getAllTestCases

Authentication: No

Request Body

Not applicable.

Path Parameters

None.

Query Parameters

None.

Success Response

```json
{
  "message": "Test cases fetched successfully",
  "testCases": [
    {
      "_id": "TEST_CASE_ID",
      "input": [
        {
          "name": "nums",
          "value": "[2,7,11,15]"
        }
      ],
      "output": "[0,1]",
      "problemId": "PROBLEM_ID"
    }
  ]
}
```

Error Responses

```json
{
  "messages": "No test cases found"
}
```

HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Test cases fetched successfully |
| 402 | No test cases found |

## GET /api/problem/:problemId/submissions

Authentication: Yes

Request Body

Not applicable.

Path Parameters

| Name | Type | Required |
|------|------|----------|
| problemId | string | Yes |

Query Parameters

None.

Success Response

```json
{
  "message": "Problem submissions fetched successfully",
  "submissions": [
    {
      "_id": "SOLUTION_ID",
      "problemId": "PROBLEM_ID",
      "userId": "USER_ID",
      "titleName": "Two Sum",
      "code": "console.log('solution')",
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
  "message": "Unauthorized"
}
```

```json
{
  "message": "Problem id is required"
}
```

```json
{
  "message": "Failed to fetch problem submissions",
  "error": "ERROR_MESSAGE"
}
```

HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Problem submissions fetched successfully |
| 400 | Problem id is required |
| 401 | Unauthorized |
| 500 | Failed to fetch problem submissions |

## DELETE /api/problem/removeTestCases/:id

Authentication: No

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
  "message": "Test case deleted successfully"
}
```

Error Responses

None defined.

HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Test cases for the problem deleted successfully |

## DELETE /api/problem/removeAllTestCases

Authentication: No

Request Body

Not applicable.

Path Parameters

None.

Query Parameters

None.

Success Response

```json
{
  "message": "All test cases deleted successfully"
}
```

Error Responses

```json
{
  "message": "Failed to delete test cases",
  "error": "ERROR_MESSAGE"
}
```

HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | All test cases deleted successfully |
| 500 | Failed to delete test cases |

## DELETE /api/problem/removeAllProblems

Authentication: No

Request Body

Not applicable.

Path Parameters

None.

Query Parameters

None.

Success Response

```json
{
  "message": "All problems deleted successfully"
}
```

Error Responses

```json
{
  "message": "Failed to delete problems",
  "error": "ERROR_MESSAGE"
}
```

HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | All problems deleted successfully |
| 500 | Failed to delete problems |

## POST /api/problem/add

Authentication: No

Request Body

```json
{
  "title": "Two Sum",
  "description": "Find two numbers that add up to target.",
  "difficulty": "easy",
  "tags": ["Array", "Hash Table"],
  "testCases": [
    {
      "input": [
        {
          "name": "nums",
          "value": "[2,7,11,15]"
        }
      ],
      "output": "[0,1]"
    }
  ]
}
```

Path Parameters

None.

Query Parameters

None.

Success Response

```json
{
  "message": "Problem added successfully",
  "problem": {
    "_id": "PROBLEM_ID",
    "title": "Two Sum",
    "description": "Find two numbers that add up to target.",
    "difficulty": "easy",
    "tags": ["Array", "Hash Table"]
  }
}
```

Error Responses

```json
{
  "message": "Failed to add problem",
  "error": "ERROR_MESSAGE"
}
```

HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 201 | Problem added successfully |
| 500 | Failed to add problem |

## POST /api/code/run

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

None.

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
| 200 | Code ran successfully |
| 401 | Unauthorized |
| 500 | Compiler request failed or compiler error |

## POST /api/code/submit

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

None.

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
    "code": "#include <iostream>\nint main(){return 0;}",
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
| 200 | Code submitted successfully |
| 401 | Unauthorized |
| 500 | Compiler request failed or compiler error |

## POST /api/code/aiReview

Authentication: Yes

Request Body

```json
{
  "code": "#include <iostream>\nint main(){return 0;}",
  "problemId": "PROBLEM_ID"
}
```

Path Parameters

None.

Query Parameters

None.

Success Response

```json
{
  "message": "AI Review generated successfully",
  "output": {}
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
  "message": "Problem not found"
}
```

```json
{
  "message": "Error in AI Review",
  "error": "ERROR_MESSAGE"
}
```

```json
{
  "message": "AI review timed out"
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
| 200 | AI review generated successfully |
| 401 | Unauthorized |
| 404 | Problem not found |
| 500 | Error in AI review or internal server error |
| 504 | AI review timed out |

## GET /api/alldata/getleaderboard

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
  "message": "Leaderboard fetched successfully",
  "leaderboard": [
    {
      "userId": "USER_ID",
      "userName": "John Doe",
      "noOfProblemsSolved": 3,
      "correct": 3,
      "wrong": 1,
      "easy": 1,
      "medium": 1,
      "hard": 1,
      "accuracy": "75.00",
      "rank": "45.30"
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
  "message": "Internal server error"
}
```

HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Leaderboard fetched successfully |
| 401 | Unauthorized |
| 500 | Internal server error |

## POST /api/resume/getReview

Authentication: Yes

Request Body

Multipart form-data.

| Name | Type | Required |
|------|------|----------|
| resume | file | Yes |

Path Parameters

None.

Query Parameters

None.

Success Response

```json
{
  "message": "Resume review generated successfully.",
  "review": {
    "strengths": ["Clear project experience"],
    "weaknesses": ["Missing measurable impact"],
    "recommendations": ["Add metrics to project bullet points"]
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
  "message": "No file uploaded. Please upload a PDF or DOCX file."
}
```

```json
{
  "message": "Unsupported file type. Please upload a PDF or DOCX file."
}
```

```json
{
  "message": "The uploaded file is empty or could not be processed."
}
```

```json
{
  "message": "Error parsing the AI response. Please try again later.",
  "error": "ERROR_MESSAGE"
}
```

```json
{
  "message": "Error processing the resume file.",
  "error": "ERROR_MESSAGE"
}
```

HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Resume review generated successfully |
| 400 | File missing, unsupported file type, or empty/unprocessable file |
| 401 | Unauthorized |
| 500 | AI response parsing failed or resume processing failed |

## GET /api/discussion/getAllDiscussions/:problemId

Authentication: Yes

Request Body

Not applicable.

Path Parameters

| Name | Type | Required |
|------|------|----------|
| problemId | string | Yes |

Query Parameters

None.

Success Response

```json
{
  "message": "Discussions fetched successfully",
  "discussions": [
    {
      "_id": "DISCUSSION_ID",
      "problemId": "PROBLEM_ID",
      "title": "How to solve this?",
      "createdAt": "2026-07-31T00:00:00.000Z",
      "updatedAt": "2026-07-31T00:00:00.000Z"
    }
  ]
}
```

```json
{
  "message": "No discussions found for this problem",
  "discussions": []
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
  "message": "Problem ID is required"
}
```

```json
{
  "message": "Error fetching discussions"
}
```

HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Discussions fetched successfully, or no discussions found |
| 400 | Problem ID is required |
| 401 | Unauthorized |
| 500 | Error fetching discussions |

## POST /api/discussion/newDiscussion

Authentication: Yes

Request Body

```json
{
  "problemId": "PROBLEM_ID",
  "title": "How to solve this?"
}
```

Path Parameters

None.

Query Parameters

None.

Success Response

```json
{
  "message": "Discussion created successfully",
  "discussion": {
    "_id": "DISCUSSION_ID",
    "problemId": "PROBLEM_ID",
    "title": "How to solve this?",
    "createdAt": "2026-07-31T00:00:00.000Z",
    "updatedAt": "2026-07-31T00:00:00.000Z"
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
  "message": "Problem ID and title are required"
}
```

```json
{
  "message": "Error creating discussion",
  "error": "ERROR_MESSAGE"
}
```

HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 201 | Discussion created successfully |
| 400 | Problem ID and title are required |
| 401 | Unauthorized |
| 500 | Error creating discussion |

## POST /api/discussion/newMessage

Authentication: Yes

Request Body

```json
{
  "discussionId": "DISCUSSION_ID",
  "message": "This is my answer."
}
```

Path Parameters

None.

Query Parameters

None.

Success Response

```json
{
  "message": "Message added successfully",
  "newMessage": {
    "_id": "MESSAGE_ID",
    "discussionId": "DISCUSSION_ID",
    "userId": "USER_ID",
    "message": "This is my answer.",
    "likes": [],
    "dislikes": [],
    "createdAt": "2026-07-31T00:00:00.000Z",
    "updatedAt": "2026-07-31T00:00:00.000Z"
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
  "message": "Discussion ID and message are required"
}
```

```json
{
  "message": "Error adding message",
  "error": "ERROR_MESSAGE"
}
```

HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 201 | Message added successfully |
| 400 | Discussion ID and message are required |
| 401 | Unauthorized |
| 500 | Error adding message |

## GET /api/discussion/getAllMessages/:discussionId

Authentication: Yes

Request Body

Not applicable.

Path Parameters

| Name | Type | Required |
|------|------|----------|
| discussionId | string | Yes |

Query Parameters

None.

Success Response

```json
{
  "message": "Messages fetched successfully",
  "messages": [
    {
      "_id": "MESSAGE_ID",
      "discussionId": "DISCUSSION_ID",
      "userId": "USER_ID",
      "message": "This is my answer.",
      "likes": ["USER_ID"],
      "dislikes": [],
      "createdAt": "2026-07-31T00:00:00.000Z",
      "updatedAt": "2026-07-31T00:00:00.000Z"
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
  "message": "Discussion ID is required"
}
```

```json
{
  "message": "Error fetching messages",
  "error": "ERROR_MESSAGE"
}
```

HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Messages fetched successfully |
| 400 | Discussion ID is required |
| 401 | Unauthorized |
| 500 | Error fetching messages |

## DELETE /api/discussion/deleteMessage/:messageId

Authentication: Yes

Request Body

Not applicable.

Path Parameters

| Name | Type | Required |
|------|------|----------|
| messageId | string | Yes |

Query Parameters

None.

Success Response

```json
{
  "message": "Message deleted successfully",
  "remainingMessages": [
    {
      "_id": "MESSAGE_ID",
      "discussionId": "DISCUSSION_ID",
      "userId": "USER_ID",
      "message": "Remaining message.",
      "likes": [],
      "dislikes": [],
      "createdAt": "2026-07-31T00:00:00.000Z",
      "updatedAt": "2026-07-31T00:00:00.000Z"
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
  "message": "Message ID is required"
}
```

```json
{
  "message": "Message not found"
}
```

```json
{
  "message": "Error deleting message",
  "error": "ERROR_MESSAGE"
}
```

HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Message deleted successfully |
| 400 | Message ID is required |
| 401 | Unauthorized |
| 404 | Message not found |
| 500 | Error deleting message |

## POST /api/discussion/likeMessage/:messageId

Authentication: Yes

Request Body

Not applicable.

Path Parameters

| Name | Type | Required |
|------|------|----------|
| messageId | string | Yes |

Query Parameters

None.

Success Response

```json
{
  "message": "Message liked successfully",
  "likes": ["USER_ID"],
  "dislikes": []
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
  "message": "Message ID is required"
}
```

```json
{
  "message": "Error liking message",
  "error": "ERROR_MESSAGE"
}
```

HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Message liked or like removed successfully |
| 400 | Message ID is required |
| 401 | Unauthorized |
| 500 | Error liking message |

## POST /api/discussion/dislikeMessage/:messageId

Authentication: Yes

Request Body

Not applicable.

Path Parameters

| Name | Type | Required |
|------|------|----------|
| messageId | string | Yes |

Query Parameters

None.

Success Response

```json
{
  "message": "Message disliked successfully",
  "dislikes": ["USER_ID"],
  "likes": []
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
  "message": "Message ID is required"
}
```

```json
{
  "message": "Error disliking message",
  "error": "ERROR_MESSAGE"
}
```

HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Message disliked or dislike removed successfully |
| 400 | Message ID is required |
| 401 | Unauthorized |
| 500 | Error disliking message |

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
    "code": "#include <iostream>\nint main(){return 0;}",
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
