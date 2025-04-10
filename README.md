# Link Preview API

A link preview API using Cloudflare Workers. It fetches OGP information from a specified URL and returns it in JSON format.

## Features

- Title extraction
- Meta description extraction
- Favicon extraction
- OGP image extraction
- 24-hour cache support

## Tech Stack

- Cloudflare Workers
- Hono
- TypeScript
- HTMLRewriter

## Setup

```bash
npm i
npm run dev
```

## Usage

### API Endpoint

```txt
GET /preview?url=[URL]
```

### Parameters

- `url`: URL to fetch preview information (required)

### Response Example

<https://linkpreview-api.yashikota.workers.dev/preview?url=https://wikipedia.org>

```json
{
  "title": "Wikipedia",
  "description": "Wikipedia is a free online encyclopedia, created and edited by volunteers around the world and hosted by the Wikimedia Foundation.",
  "favicon": "https://wikipedia.org/static/favicon/wikipedia.ico",
  "ogImage": "https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/2244px-Wikipedia-logo-v2.svg.png"
}
```
