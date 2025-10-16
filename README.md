🧠 1. Backend README (Node.js + Express + MongoDB)
📁 Project: Vasundhara Vehicle Management (Backend)
🚀 Overview

This backend handles Brand + Vehicle CRUD operations with image upload functionality using multer.
It supports both local and deployed (Railway) environments, managing image files and API data in MongoDB.

⚙️ Tech Stack

Node.js + Express.js — Server & REST API

MongoDB + Mongoose — Database

Multer — Image uploads

CORS — Cross-origin support

dotenv — Environment variable management

Railway — Cloud deployment


📦 Folder Structure

backend/
│
├── server.js                # Main entry point
├── .env                     # Environment variables
├── package.json
│
├── models/
│   ├── Brand.js
│   └── Vehicle.js
│
├── controllers/
│   └── brandController.js   # CRUD logic for brands & vehicles
│
├── routes/
│   └── brandRoutes.js       # Express routes
│
├── uploads/                 # Uploaded images (auto-created)
│
└── config/
    └── db.js                # MongoDB connection


⚙️ Installation & Setup

1️⃣ Clone the Repository

git clone https://github.com/<your-username>/vasundhara-vehicle-backend.git
cd vasundhara-vehicle-backend

2️⃣ Install Dependencies
npm install

3️⃣ Create .env File

PORT=5000
MONGO_URI=mongodb+srv://<your-db-user>:<password>@cluster.mongodb.net/vasundhara
CLIENT_URL=http://localhost:5173


4️⃣ Run the Server

npm run dev


The API will run at:
👉 http://localhost:5000


| Method     | Endpoint                           | Description                           |
| ---------- | ---------------------------------- | ------------------------------------- |
| **POST**   | `/api/brands`                      | Create brand + vehicles (with images) |
| **GET**    | `/api/brands`                      | Get all brands with their vehicles    |
| **PUT**    | `/api/brands/:brandId`             | Update brand + vehicles               |
| **DELETE** | `/api/brands/:brandId`             | Delete brand and its vehicles         |
| **PATCH**  | `/api/brands/soft-delete/:brandId` | Soft delete brand                     |

