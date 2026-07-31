# Resume API Contract

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
