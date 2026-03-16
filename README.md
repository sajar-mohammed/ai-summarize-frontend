# AI Summarizer - Frontend 🚀

The frontend of the AI Summarizer application, built with React and Vite. This application provides a premium user interface for summarizing articles, web pages, and documents using advanced AI.

## ✨ Features

- **AI Summarization**: Instantly summarize long articles and web content.
- **URL & File Support**: Summarize directly from a URL or by uploading text/files.
- **Premium Features**:
  - URL Summarization
  - PDF Export
  - Custom AI Tone (Professional, Casual, Creative)
- **Modern UI/UX**: Built with Framer Motion for smooth animations and a premium feel.
- **Analytics & Monitoring**: Integrated with Microsoft Clarity, Google Analytics (GA4), and Sentry for error tracking.

## 🛠️ Tech Stack

- **Framework**: [React](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sajar-mohammed/ai-summarize-frontend.git
   cd ai-summarize-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables:
   ```env
   VITE_API_BASE=your_backend_api_url
   VITE_CLARITY_ID=your_clarity_project_id
   VITE_GA4_ID=your_ga4_measurement_id
   VITE_SENTRY_DSN=your_sentry_dsn
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 🌐 Deployment

This project is configured for deployment on **Vercel**. 

- **Automatic Deploys**: Every push to the `main` branch trigger a new build on Vercel.
- **Environment Variables**: Ensure all variables in `.env` are also added to the Vercel Project Settings.

## 📈 Monitoring

- **Microsoft Clarity**: Visualizes user behavior through heatmaps and recordings.
- **Google Analytics**: Tracks user metrics and site performance.
- **Sentry**: Captures frontend errors and performance bottlenecks in real-time.

---
Built with ❤️ by Sajar Mohammed
