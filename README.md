# 📘 InfoStack — Retrieval-Augmented Generation Playground

**InfoStack** is a full-stack **Retrieval-Augmented Generation (RAG)** application that allows users to upload their own data sources and interact with them through a **document-grounded AI assistant**.

Unlike generic chatbots, InfoStack focuses on:
- Grounded answers
- Transparent retrieval
- Clear separation between **document knowledge** and **AI reasoning**

---

## 🧠 Why InfoStack?

Traditional AI chatbots often:
- Hallucinate answers
- Mix external knowledge with user-provided data
- Provide no visibility into how answers are generated

InfoStack solves this by:
- Letting users **bring their own data**
- Enforcing **document-only answers** when required
- Making the RAG pipeline **visible, explainable, and trustworthy**

---

## 📁 Project Structure

```text
InfoStack/
├── backend/
│   ├── routes/             # API endpoints (query, upload, scrape)
│   ├── services/           # Gemini, Qdrant, RAG orchestration
│   ├── uploads/            # Uploaded documents
│   ├── docker-compose.yml  # Qdrant & backend services
│   └── index.js            # Backend entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Chat, uploads, navigation
│   │   ├── pages/          # Main views
│   │   └── App.jsx
│   └── vite.config.js
│
├── .gitignore
└── README.md
```
---

## 🏗️ System Overview

InfoStack follows a **standard Retrieval-Augmented Generation (RAG) workflow** with clear separation between data ingestion, retrieval, and generation.

### High-Level Flow
1. User uploads data (text, files, images, or websites)
2. Data is cleaned and split into meaningful chunks
3. Chunks are converted into vector embeddings
4. Embeddings are stored in the vector database (**Qdrant**)
5. User submits a query
6. Relevant chunks are retrieved using semantic similarity
7. Retrieved context is passed to the LLM (**Gemini**) to generate the final answer

---

## 🧠 Query Modes

InfoStack supports two distinct query modes to control AI behavior.

### 🔒 Strict Mode (Document-Grounded)
- Answers are generated **only from uploaded documents**
- No external or general AI knowledge is allowed
- If the answer is not found, the system explicitly states it
- Guarantees zero hallucination of document facts

**Ideal for:**  
Compliance checks, academic validation, factual document QA

---

### 🔀 Hybrid Mode (Document + AI Reasoning)
- Uploaded documents are always prioritized
- General AI reasoning is allowed when appropriate
- Document-specific facts are never fabricated
- Responses balance accuracy and explanation

**Ideal for:**  
Summaries, explanations, and exploratory questions

---

## ✨ Core Features

- Multi-source data ingestion (Text, Files, Images, Websites)
- Transparent and explainable indexing pipeline
- Vector similarity search with **Qdrant**
- Dual query modes for controlled AI behavior
- Session-based conversational interface
- Clean, developer-focused user experience

---

## 🛠️ Tech Stack

### 🎨 Frontend
- **React** — component-based UI development
- **Vite** — fast development server and optimized builds
- **Tailwind CSS** — utility-first styling
- **Lucide Icons** — modern iconography
- Modular, component-driven architecture

---

### ⚙️ Backend
- **Node.js** — server-side runtime
- **Express** — REST API framework
- Route–Service architecture for maintainability
- **Multer** — file upload handling
- **Docker & Docker Compose** — containerized services

---

### 🧠 AI & RAG Pipeline
- **Gemini API** — response generation
- **Qdrant** — vector database for semantic search
- Chunking and embedding pipeline
- Prompt-controlled generation for grounded responses

---

### 🔐 Configuration & Tooling
- Environment-based configuration using `.env`
- Git & GitHub for version control
- ESLint for code quality
- npm for dependency management

---

## 🚀 Project Goals

InfoStack is designed to:
- Demonstrate **real-world RAG system design**
- Provide a **transparent and trustworthy AI interface**
- Serve as a **learning and experimentation platform**
- Act as a **resume-ready full-stack AI project**

---
## 🔮 Future Enhancements
- Authentication and user workspaces
- Source-level citations in responses
- Multiple vector collections
- Streaming responses

## 👤 Author

**Manthan Sharma**