🧠 1. Backend README (Node.js + Express + MongoDB)
📁 Project: Vasundhara Vehicle Management (Backend)
🚀 Overview

This backend handles Brand + Vehicle CRUD operations with image upload functionality using multer.
It supports both local and deployed (Railway) environments, managing image files and API data in MongoDB.
## ⚙️ Tech Stack

**Server & REST API:** Node.js + Express.js 

**Database:** MongoDB + Mongoose 

**Image handel:** Multer 

**Cross-origin support:** CORS 

**Environment variable management:** dotenv

**Debug Log:** Morgan 



## Run Locally
⚙️ Installation & Setup

Clone the project

```bash
https://github.com/rushikeshtaur12/vasundhara-backend

```

Go to the project directory

```bash
  cd vasundhara-backend
```

Install dependencies

```bash
  npm install
```


Create .env File and configure

```bash
PORT=5000
MONGO_URI=mongodb+srv://<your-db-user>:<password>@cluster.mongodb.net/vasundhara

```


Start the server
```bash
  npm run dev
```

The API will run at:
```bash
👉 http://localhost:5000
```
## Folder Structure



backend/


├─ server.js # Main entry point of the backend

├── package.json # Project dependencies and scripts
├── .env # Environment variables (MongoDB URI, PORT, etc.)
│
├── config/
│ └── db.js # MongoDB connection setup
│
├── models/
│ ├── Brand.js # Brand Mongoose schema
│ └── Vehicle.js # Vehicle Mongoose schema
│
├── controllers/
│ └── brandController.js # CRUD logic for brands & vehicles
│
├── routes/
│ └── brandRoutes.js # Express routes for brand & vehicle APIs
│
├── uploads/ # Directory for uploaded images (auto-created)
│
└── utils/ # Optional: helper functions (like deleteImage.js)
## Endpoint

| Method     | Endpoint                           | Description                           |
| ---------- | ---------------------------------- | ------------------------------------- |
| **POST**   | `/api/brands/create`                      | Create brand + vehicles (with images) |
| **GET**    | `/api/brands`                      | Get all brands with their vehicles    |
| **PATCH**    | `/api/brands/:brandId`             | Update brand + vehicles               |
| **DELETE** | `/api/brands/:brandId`             | Delete brand and its vehicles         |