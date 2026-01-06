# 📘 InfoStack — Retrieval-Augmented Generation Playground

**InfoStack** is a full-stack **Retrieval-Augmented Generation (RAG)** application that allows users to upload their own data sources and interact with them through a **document-grounded AI assistant**.

Unlike generic chatbots, InfoStack is built around **control, transparency, and trust**.

It ensures a clear separation between:
- **User-provided document knowledge**
- **AI reasoning and generation**

---

## 🧠 Why InfoStack?

Traditional AI chatbots often:
- Hallucinate answers
- Mix external knowledge with private data
- Provide no visibility into how answers are formed

**InfoStack solves this by design.**

It allows users to:
- Bring their **own data**
- Choose how strictly the AI should behave
- Clearly see *where answers come from*

---

## 🎯 Key Principles

- Grounded answers
- Explicit retrieval
- Zero document hallucination in strict mode
- Explainable RAG pipeline

---

## 📁 Project Structure

```text
InfoStack/
├── backend/
│   ├── routes/             # API endpoints (query, upload, scrape, delete)
│   ├── services/           # Gemini, Qdrant, RAG orchestration
│   ├── uploads/            # Uploaded documents
│   ├── docker-compose.yml  # Qdrant service
│   └── index.js            # Backend entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Chat UI, sidebar, uploads
│   │   ├── pages/          # Main views
│   │   └── App.jsx
│   └── vite.config.js
│
├── .gitattributes
├── .gitignore
└── README.md
```
---

## 🏗️ System Overview

InfoStack follows a **production-grade Retrieval-Augmented Generation (RAG) workflow**
with a clear separation between ingestion, retrieval, and generation.

### High-Level Flow

1. User uploads data (text, PDFs, images, or websites)
2. Data is cleaned and split into semantic chunks
3. Chunks are converted into vector embeddings
4. Embeddings are stored in the vector database (**Qdrant**)
5. User submits a query
6. Relevant chunks are retrieved using semantic similarity
7. Retrieved context is passed to **Gemini** for final answer generation

---

## 🧠 Query Modes

InfoStack provides **two explicit query modes** to control AI behavior.

### 🔒 Strict Mode (Document-Only)
- Answers are generated **only from uploaded documents**
- No general AI knowledge is allowed
- If the answer is not found, the system clearly states it
- Guarantees **zero hallucination of document facts**

Best suited for:
- Compliance checks
- Academic validation
- Factual document-based Q&A

---

### 🔀 Hybrid Mode (Document + AI Reasoning)
- Uploaded documents are always prioritized
- General AI reasoning is allowed when appropriate
- Document-specific facts are never fabricated
- Balances accuracy with explanation

Best suited for:
- Concept explanations
- Summaries
- Exploratory and mixed questions

---

## ✨ Core Features

- Multi-source data ingestion (Text, PDFs, Images, Websites)
- Transparent chunking and indexing pipeline
- Vector similarity search powered by **Qdrant**
- Strict and Hybrid query modes
- Session-based conversational interface
- Source-aware responses
- Safe handling of empty or deleted vector collections

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Lucide Icons

### Backend
- Node.js
- Express
- Multer (file uploads)
- Docker

### AI & RAG Pipeline
- Gemini API
- Qdrant Vector Database
- Recursive text chunking
- Prompt-controlled generation

---

## 🚀 Project Goals

InfoStack is designed to:
- Demonstrate **real-world RAG system design**
- Enforce **hallucination-free document QA**
- Provide a transparent and explainable AI interface
- Serve as a **resume-ready full-stack AI project**

---

## 🔮 Future Enhancements

- Authentication and user workspaces
- Source-level citation highlighting
- Multiple vector collections
- Streaming responses
- Usage analytics and monitoring

---

## 👤 Author

**Manthan Sharma**  
Computer Science Engineering Student  
Full-Stack & Applied AI Enthusiast
