import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import brandRoutes from './routes/brandRoutes.js';
import morgan from 'morgan';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Whitelist frontend domains
const allowedOrigins = [
  "http://localhost:3000",               // dev
  "https://vasundara.netlify.app"        // deployed frontend
];


app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin (like Postman)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET","POST","PATCH","DELETE","OPTIONS"]
}));

app.use(express.json());
app.use(morgan("combined"))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get("/", (req, res) => res.send("API running"));

// Routes
app.use('/api/brands', brandRoutes);

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
