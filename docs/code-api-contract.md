# Code API Contract

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
