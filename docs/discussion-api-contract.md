# Discussion API Contract

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
