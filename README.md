# Savyy - Your Smart Banking Promotions Assistant

## Introduction
Savyy is an intelligent platform that helps users discover and manage bank promotions effortlessly. The app notifies users about relevant bank offers based on their cards, saving them money when shopping online and ensuring they never miss a valuable promotion.

## 👀 Preview
<video src="https://github.com/user-attachments/assets/d12024b8-d2e2-4b69-8384-752b4c035bdd" autoplay loop muted controls width="800"></video>

## Features

### 🔍 Smart Promotion Discovery
- Real-time scraping of bank websites for the latest promotions
- RAG (Retrieval Augmented Generation) system to answer user queries about promotions
- AI-powered matching of promotions to user's cards and preferences

### 💳 Card Management
- Secure storage and management of bank cards
- Support for multiple cards across different banks

### 🔔 Intelligent Notifications
- Instant alerts for bank promotions relevant to user's cards

## Technologies Used

### Frontend
- React with TypeScript
- Vite for fast builds and development
- Tailwind CSS for responsive design
- shadcn/ui component library
- Framer Motion for animations
- React Router for navigation

### Backend
- Node.js with Express
- Puppeteer for web scraping
- OpenAI API for the RAG system
- Qdrant vector database for similarity search
- Supabase for authentication and database

### DevOps
- Vercel for frontend deployment
- Railway/Vercel for backend hosting
- Git for version control

## Installation

```sh
# Clone the repository
git clone https://github.com/Matifassano/savyy.git

# Navigate to the project directory
cd savyy

# Install dependencies
npm i

# Copy the example environment file and configure your environment variables
cp .env.example .env

# Start the development server
npm run dev
```

For backend setup:

```sh
# Navigate to the backend directory
cd backend

# Install backend dependencies
npm i

# Copy the example environment file and configure your environment variables
cp .env.example .env

# Start the backend server
node server.js
```

## Usage

1. **Sign up/Login**: Create an account or sign in to access your dashboard
2. **Add Cards**: Add your bank cards to start receiving relevant promotions
3. **Explore Promotions**: Browse current promotions or ask Savyy about specific offers
4. **Ask Questions**: Use the chat feature to inquire about promotions with natural language
5. **Get Notifications**: Receive alerts when promotions matching your cards are available

## Contributing

We welcome contributions to Savyy! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

---

Made with ❤️ by [Savyy Team](https://github.com/Matifassano/savyy)