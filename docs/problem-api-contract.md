# Problem API Contract

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
