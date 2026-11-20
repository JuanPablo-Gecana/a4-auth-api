import 'dotenv/config';
import express from 'express';
import { supabase } from './supabaseClient.js';
import { requireAuth } from './middleware/auth.js';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'node:fs';

const app = express();
app.use(express.json()); 

const openapi = JSON.parse(readFileSync(new URL('./openapi.json', import.meta.url), 'utf-8'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi));

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

app.get('/protected/profile', requireAuth, (req, res) => {
  res.status(200).json({id: req.user.id, email: req.user.email, created_at: req.user.created_at});
});

app.post('/auth/logout', requireAuth, async (req, res) => {
  const { error } = await supabase.auth.signOut();

  if(error){
    return res.status(500).json({error: error.message})
  }

  res.status(204).send()
});

app.get('/protected/dashboard', requireAuth, (req, res) => {
  res.status(200).json({ message: "Welcome to your dashboard, ${req.user.email}"})
  // TODO: return 200 with { message: `Welcome to your dashboard, ${req.user.email}` }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} and connected to Supabase`);
});