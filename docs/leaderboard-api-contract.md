# Leaderboard API Contract

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
