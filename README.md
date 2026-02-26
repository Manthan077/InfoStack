# 📘 InfoStack — Retrieval-Augmented Generation Playground

<div align="center">

![InfoStack Banner](https://img.shields.io/badge/RAG-Playground-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![Qdrant](https://img.shields.io/badge/Qdrant-Vector_DB-DC382D?style=for-the-badge)
![Gemini](https://img.shields.io/badge/Google-Gemini_AI-4285F4?style=for-the-badge&logo=google)

**A production-grade RAG system for document-grounded AI conversations**

[Features](#-core-features) • [Live Demo](https://infostack.vercel.app/) • [Installation](#-quick-start) • [Tech Stack](#️-tech-stack)

</div>

---

## 🎯 Overview

**InfoStack** is a full-stack **Retrieval-Augmented Generation (RAG)** application that transforms how users interact with their documents. Upload PDFs, websites, images, or text, and query them through an intelligent AI assistant that provides **transparent, source-backed answers**.

Unlike generic chatbots that hallucinate or mix external knowledge with your data, InfoStack ensures:

✅ **Grounded Answers** — Every response is backed by your uploaded documents  
✅ **Source Transparency** — See exactly where information comes from  
✅ **Zero Hallucination Mode** — Strict mode prevents AI from fabricating facts  
✅ **Full Control** — Choose between strict document-only or hybrid AI reasoning modes

---

## ✨ Core Features

### 📤 Multi-Source Data Ingestion
- **Text Input** — Paste or write text directly
- **PDF Upload** — Extract and index PDF documents
- **Image Upload** — OCR and index image content
- **Website Scraping** — Fetch and index web pages

### 🧠 Intelligent Query Modes

#### 🔒 Strict Mode (Document-Only)
- Answers **only** from uploaded documents
- Zero hallucination guarantee
- Perfect for compliance, legal, and academic use

#### 🔀 Hybrid Mode (Document + AI Reasoning)
- Prioritizes documents but allows AI explanations
- Best for concept exploration and summaries
- Balances accuracy with contextual understanding

### 🎨 Modern UI/UX
- **Responsive Design** — Seamless mobile and desktop experience
- **Real-time Progress** — Visual feedback during indexing
- **Session Management** — Maintain conversation context
- **Source Attribution** — Click-through citations for every answer
- **Edit & Regenerate** — Refine queries and regenerate responses

### 🔧 Production-Ready Features
- **Vector Search** — Semantic similarity with Qdrant
- **Chunking Strategy** — Recursive text splitting for optimal retrieval
- **Error Handling** — Graceful degradation and user feedback
- **Document Management** — Add, view, and delete indexed sources

---

## 📁 Project Structure

```text
InfoStack/
├── backend/
│   ├── routes/
│   │   ├── query.js           # Query endpoint with RAG logic
│   │   ├── upload.js          # File upload handler
│   │   ├── text.js            # Text indexing
│   │   ├── website.js         # Website scraping
│   │   └── deleteDocument.js  # Document deletion
│   ├── services/
│   │   ├── gemini.js          # Gemini API integration
│   │   ├── qdrant.js          # Vector DB operations
│   │   └── ragChain.js        # RAG orchestration
│   ├── uploads/               # Temporary file storage
│   ├── docker-compose.yml     # Qdrant container setup
│   ├── index.js               # Express server
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatBox.jsx    # Chat interface
│   │   │   ├── Sidebar.jsx    # Upload panel
│   │   │   └── Navbar.jsx     # Top navigation
│   │   ├── pages/
│   │   │   └── Home.jsx       # Main layout
│   │   ├── App.jsx
│   │   └── index.css
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|----------|
| **React 18** | UI framework |
| **Vite** | Build tool & dev server |
| **Tailwind CSS** | Utility-first styling |
| **Lucide Icons** | Icon library |

### Backend
| Technology | Purpose |
|------------|----------|
| **Node.js** | Runtime environment |
| **Express** | Web framework |
| **Multer** | File upload handling |
| **Axios** | HTTP client |
| **Cheerio** | Web scraping |

### AI & Vector Database
| Technology | Purpose |
|------------|----------|
| **Google Gemini** | LLM & embeddings |
| **Qdrant** | Vector database |
| **Docker** | Qdrant containerization |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Google Gemini API Key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/infostack.git
cd infostack
```

2. **Start Qdrant Vector Database**
```bash
cd backend
docker-compose up -d
```

3. **Configure Backend**
```bash
cd backend
npm install

# Copy .env.example to .env and add your API key
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

4. **Start Backend Server**
```bash
node index.js
```

5. **Configure Frontend**
```bash
cd ../frontend
npm install

# Update src/config.js with backend URL
```

6. **Start Frontend**
```bash
npm run dev
```

7. **Open Browser**
```
http://localhost:5173
```

---

## 📖 Usage Guide

### 1. Upload Documents
- **Text**: Paste content directly in the text area
- **Files**: Drag & drop PDFs or images
- **Websites**: Enter URL and click "Index Website"

### 2. Select Query Mode
- **Strict**: Document-only answers (no hallucination)
- **Hybrid**: Document + AI reasoning

### 3. Ask Questions
- Type your query in the chat input
- View AI response with source citations
- Click sources to see original content

### 4. Manage Documents
- View indexed sources in sidebar
- Delete individual documents
- Clear all sources

---

## 🎯 Use Cases

| Scenario | Mode | Example |
|----------|------|----------|
| **Legal Document Review** | Strict | "What are the termination clauses?" |
| **Research Paper Analysis** | Strict | "What methodology was used?" |
| **Technical Documentation** | Hybrid | "Explain how authentication works" |
| **Meeting Notes Summary** | Hybrid | "Summarize key action items" |
| **Compliance Checking** | Strict | "Does this meet GDPR requirements?" |

---

## 🔮 Roadmap

- [ ] **Authentication** — User accounts and workspaces
- [ ] **Multi-Collection** — Separate vector stores per project
- [ ] **Streaming Responses** — Real-time answer generation
- [ ] **Citation Highlighting** — Inline source highlighting
- [ ] **Export Conversations** — Download chat history
- [ ] **Advanced Chunking** — Semantic and hierarchical chunking
- [ ] **Analytics Dashboard** — Usage metrics and insights
- [ ] **API Access** — RESTful API for integrations

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Manthan Sharma**  
🎓 Computer Science Engineering Student  
💼 Full-Stack & Applied AI Enthusiast  

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/manthan-sharma7)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github)](https://github.com/Manthan077)
[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-FF5722?style=for-the-badge&logo=google-chrome)](https://manthan-sharma-portfolio.vercel.app/)

---

## 🙏 Acknowledgments

- **Google Gemini** for powerful LLM and embedding capabilities
- **Qdrant** for high-performance vector search
- **React & Vite** for modern frontend development
- **Tailwind CSS** for beautiful, responsive design

---

<div align="center">

**⭐ Star this repo if you find it useful!**

Made with ❤️ by Manthan Sharma

</div>
