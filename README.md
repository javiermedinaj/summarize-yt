# YouTube Video Summarizer

A web application that leverages AI to generate concise summaries of YouTube videos (less than 15 minutes), helping users save time and quickly grasp video content. This is a preliminary version, and future updates may support longer videos as we explore other AI models.

## 🚀 Features

- YouTube video URL input
- AI-powered video summarization
- Clean and user-friendly interface
- Quick summary generation
- Responsive design

## 🛠 Technologies Used

- **Frontend:**
    - React
    - TypeScript
    - TailwindCss

- **Backend:**
    - Express.js
    - Node.js

- **AI Integration:**
    - Azure AI Services

## 💻 Setup and Installation

1. Clone the repository:
```bash
git clone https://github.com/javiermedinaj/yt-summarizer.git
```

2. Install dependencies:
```bash
# Frontend
cd client
npm install

# Backend
cd server
npm install
```

3. Set up environment variables:
- Create `.env` file in server directory
- Add your Azure AI credentials

4. Start the application:
```bash
# Frontend
npm run dev

# Backend
npm start
```

## 📁 Project Structure

```
yt-summarizer/
├── client/          # React frontend
├── server/          # Express backend
├── .env
└── README.md
```



