import 'dotenv/config';
import express from 'express';
import { supabase } from './supabaseClient.js';

const app = express();
app.use(express.json()); 

app.post('/auth/signup', async (req, res) => {
  const { email, password } = req.body ?? {};

  if(!email || !password){
    return res.status(400).json({ error: "Email or Password is missing" })
  }

  const { data, error } = await supabase.auth.signUp({ email, password });

  if(error){
    return res.status(400).json({ error: error.message })
  }

  res.status(201).json(data.user)
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body ?? {};

  if(!email || !password){
    return res.status(400).json({ error: "Email or Password is missing" })
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if(error){
    return res.status(401).json({ error: "Invalid login credentials" })
  }
  res.json({access_token: data.session.access_token, refresh_token: data.session.refresh_token})
});

app.get('/public/info', (req, res) => {
  res.status(200).json({ message: "HELLO WORLD, THIS IS PUBLIC" })
});

app.get('/protected/profile', (req, res) => {
  const authHeader = req.headers.authorization;

  if(!authHeader || !authHeader.startsWith("Bearer ")){
    return res.status(401).json({ error: "Access token required" })
  }

  const token = authHeader.split(' ')[1];

 if(!token){
    return res.status(401).json({ error: "Access token required" })
 }

 res.status(200).json({ message: "Token recieved." })
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} and connected to Supabase`);
});