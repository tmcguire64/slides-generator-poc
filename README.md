# slides-generator-poc

A minimal Node.js app that:
- Copies a Google Slides template
- Replaces placeholders with user input
- Returns a shareable link to the generated deck

## Setup

1️⃣ Create a Google Cloud project  
2️⃣ Enable Google Slides API + Drive API  
3️⃣ Create a service account and download its JSON key  
4️⃣ Share your Slides template file with the service account (Editor access)

## Run locally

```bash
npm install
node index.js
