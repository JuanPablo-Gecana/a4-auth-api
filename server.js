import 'dotenv/config';
import express from 'express';
import { supabase } from './supabaseClient.js';

const app = express();
app.use(express.json()); 



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} and connected to Supabase`);
});