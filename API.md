# API Reference

## Base URL

```
http://localhost:3001/api
```

## Endpoints

### Health Check

Check if the service is running and healthy.

**Request:**
```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-03-28T16:12:35.797Z"
}
```

**Status Code:** 200 OK

---

### Get Available Strategies

List all built-in prisoner strategies available.

**Request:**
```http
GET /api/strategies
```

**Response:**
```json
{
  "strategies": [
    {
      "id": "loop-following",
      "name": "Loop Following Strategy",
      "description": "Prisoners follow loops in box numbers. Success if all cycles ≤ 50.",
      "successRate": "~31%"
    },
    {
      "id": "random",
      "name": "Random Strategy",
      "description": "Prisoners open random boxes.",
      "successRate": "~0.0000000030%"
    },
    {
      "id": "sequential",
      "name": "Sequential Strategy",
      "description": "Prisoners open boxes in order.",
      "successRate": "Very low"
    }
  ]
}
```

**Status Code:** 200 OK

---

### Solve Problem (Single Trial)

Generate a random box configuration and solve it using the loop-following strategy.

**Request:**
```http
POST /api/solve
```

**Response:**
```json
{
  "success": true,
  "boxes": [99, 17, 14, 92, 46, ...],
  "cycleInfo": {
    "cycles": [
      [0, 99, 63, 89, ...],
      [1, 17, 56, ...],
      ...
    ],
    "sizes": [45, 32, 12, ...],
    "maxCycleSize": 45
  },
  "prisonersDetail": [
    {
      "startPrisoner": 0,
      "cycleLength": 45,
      "success": true,
      "path": [0, 99, 63, 89, ...]
    },
    ...
  ]
}
```

**Status Code:** 200 OK

**Fields:**
- `success` (boolean): Whether all prisoners succeed
- `boxes` (array): The box configuration (boxes[i] contains the value in box i)
- `cycleInfo` (object): Cycle analysis information
  - `cycles`: All cycles in the permutation
  - `sizes`: Length of each cycle
  - `maxCycleSize`: Largest cycle (determines success)
- `prisonersDetail`: Detailed info for each prisoner

---

### Simulate Multiple Trials

Run N trials of the problem and get success statistics.

**Request:**
```http
POST /api/simulate
Content-Type: application/json

{
  "trials": 100
}
```

**Query/Body Parameters:**
- `trials` (number, required): Number of trials to run (1-10000)

**Response:**
```json
{
  "successCount": 31,
  "totalTrials": 100,
  "successRate": 31,
  "results": [
    {
      "trialNum": 1,
      "success": true,
      "maxCycleSize": 43
    },
    {
      "trialNum": 2,
      "success": false,
      "maxCycleSize": 85
    },
    ...
  ]
}
```

**Status Code:** 200 OK

**Fields:**
- `successCount`: Number of successful trials
- `totalTrials`: Total number of trials run
- `successRate`: Percentage of successful trials
- `results`: Array with details for each trial

**Error Response (400 Bad Request):**
```json
{
  "error": "Trials must be between 1 and 10000"
}
```

---

### Analyze Box Configuration

Analyze an existing box configuration for cycles and generate visualization data.

**Request:**
```http
POST /api/analyze-boxes
Content-Type: application/json

{
  "boxes": [1, 0, 3, 2, 4, 5, ...]
}
```

**Body Parameters:**
- `boxes` (array, required): Array of exactly 100 elements, a permutation of 0-99

**Response:**
```json
{
  "success": true,
  "cycleInfo": {
    "cycles": [[0, 1], [2, 3], [4], [5], ...],
    "sizes": [2, 2, 1, 1, ...],
    "maxCycleSize": 50
  },
  "cyclesToVisualize": [
    {
      "cycleId": 0,
      "size": 2,
      "boxes": [0, 1],
      "color": "#2ecc71"
    },
    {
      "cycleId": 1,
      "size": 2,
      "boxes": [2, 3],
      "color": "#2ecc71"
    },
    ...
  ]
}
```

**Status Code:** 200 OK

**Color Codes:**
- `#2ecc71` (Green): Cycles ≤ 10
- `#27ae60` (Dark Green): Cycles 11-25
- `#f39c12` (Orange): Cycles 26-50
- `#e74c3c` (Red): Cycles 51-75
- `#c0392b` (Dark Red): Cycles > 75

**Error Response (400 Bad Request):**
```json
{
  "error": "Boxes must be an array of 100 elements"
}
```

---

### Test Custom Strategy

Execute a user-defined strategy against N trials of the problem.

**Request:**
```http
POST /api/custom-strategy
Content-Type: application/json

{
  "trials": 10,
  "strategyCode": "return prisoner;"
}
```

**Body Parameters:**
- `trials` (number, required): Number of trials to run (1-10000)
- `strategyCode` (string, required): JavaScript function body

**Strategy Function Signature:**

Your strategy code will have access to:
- `prisoner` (number): Current prisoner number (0-99)
- `boxes` (array): Boxes array where boxes[i] contains the value in box i
- `opensBoxes` (Set): Set of box indices already opened by this prisoner
- `numberInBox` (number/undefined): The number found in the last box opened

The function must return the next box number to open (0-99).

**Example Strategies:**

Loop-following (default):
```javascript
// First call: prisoner=0, numberInBox=undefined
// Start by opening box with your number
if (opensBoxes.size === 0) {
  return prisoner;
}
// Follow the number we found
return numberInBox;
```

Sequential:
```javascript
// Open boxes 0, 1, 2, ... in order
return opensBoxes.size;
```

**Response:**
```json
{
  "successCount": 3,
  "totalTrials": 10,
  "successRate": 30,
  "trialResults": [
    {
      "trialNum": 1,
      "success": true,
      "successfulCount": 100
    },
    {
      "trialNum": 2,
      "success": false,
      "successfulCount": 87
    },
    ...
  ]
}
```

**Status Code:** 200 OK

**Error Responses:**

Invalid strategy code (400 Bad Request):
```json
{
  "error": "Invalid strategy code: Unexpected token )"
}
```

Strategy execution error (400 Bad Request):
```json
{
  "error": "Strategy execution error: Cannot read property 'size' of undefined"
}
```

---

## Error Handling

All error responses will return appropriate HTTP status codes:

- **400 Bad Request**: Invalid input parameters or malformed request
- **404 Not Found**: Endpoint doesn't exist
- **500 Internal Server Error**: Unexpected server error

Error response format:
```json
{
  "error": "Description of the error"
}
```

---

## Rate Limiting

No rate limiting is implemented. For production use, consider adding:
- Rate limiting middleware
- API key authentication
- Request validation and sanitization

---

## Examples

### Curl Examples

**Health Check:**
```bash
curl http://localhost:3001/api/health
```

**Get Strategies:**
```bash
curl http://localhost:3001/api/strategies
```

**Solve Once:**
```bash
curl -X POST http://localhost:3001/api/solve
```

**Run 100 Trials:**
```bash
curl -X POST http://localhost:3001/api/simulate \
  -H "Content-Type: application/json" \
  -d '{"trials": 100}'
```

**Test Custom Strategy:**
```bash
curl -X POST http://localhost:3001/api/custom-strategy \
  -H "Content-Type: application/json" \
  -d '{
    "trials": 5,
    "strategyCode": "return prisoner;"
  }'
```

### JavaScript/Fetch Examples

**Solve Problem:**
```javascript
const response = await fetch('/api/solve', {
  method: 'POST'
});
const data = await response.json();
console.log(`Success: ${data.success}, Max Cycle: ${data.cycleInfo.maxCycleSize}`);
```

**Run Simulation:**
```javascript
const response = await fetch('/api/simulate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ trials: 100 })
});
const data = await response.json();
console.log(`Success Rate: ${data.successRate}%`);
```

**Test Custom Strategy:**
```javascript
const strategyCode = `
  if (opensBoxes.size === 0) {
    return prisoner;
  }
  return numberInBox;
`;

const response = await fetch('/api/custom-strategy', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    trials: 50,
    strategyCode: strategyCode
  })
});
const data = await response.json();
console.log(`Custom strategy success rate: ${data.successRate}%`);
```

---

## Changelog

### Version 1.0.0
- Initial API release
- All core endpoints functional
- Health checks implemented
- Custom strategy support
